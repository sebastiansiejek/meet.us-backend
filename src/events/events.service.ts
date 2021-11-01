import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { IEventState } from './IEvents';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  create(createEventInput: CreateEventInput, user: User) {
    return this.eventsRepository.save({
      ...createEventInput,
      user,
    });
  }

  findOne(eventId: string) {
    return this.eventsRepository.findOne({
      relations: ['user'],
      where: { id: eventId },
    });
  }

  async findAll(
    limit: number,
    offset: number,
    field: string,
    sort: string,
    query: string,
    state: IEventState,
    userId: string,
    distance: number,
    userLat: number,
    userLong: number,
  ) {
    const currentDate = new Date().toISOString().replace('T', ' ');

    const events = this.eventsRepository
      .createQueryBuilder('events')
      .innerJoinAndMapOne(
        'events.user',
        User,
        'users',
        'events.user = users.id',
      )
      .where(
        '(events.title like  :title or events.description like :description)',
        { title: `%${query}%`, description: `%${query}%` },
      )
      .orderBy(`events.${field}`, 'ASC' == sort ? 'ASC' : 'DESC');

    if (distance !== null && userLat !== null && userLong !== null) {
      console.log('test');
      console.log(userLat);
      console.log(userLong);
      console.log(distance);
      //TODO  GET DISTANCE
      events.select(
        `( 6371 * acos( cos( radians(${userLat}) ) * cos( radians( events.lat ) ) * cos( radians( events.long ) - radians(${userLong}) ) + sin( radians(${userLat}) )* sin( radians( events.lat ) ) ) ) AS event_distance `,
      );
    }

    if (state === 'DURING') {
      events
        .andWhere('events.startDate <= :startDate', {
          startDate: currentDate,
        })
        .andWhere('events.endDate >= :endDate', {
          endDate: currentDate,
        });
    }

    if (state === 'FUTURE') {
      events.andWhere('events.startDate > :startDate', {
        startDate: currentDate,
      });
    }

    if (state === 'PAST') {
      events.andWhere('events.startDate < :startDate', {
        startDate: currentDate,
      });
    }

    if (userId) {
      events.andWhere('events.user = :userId', {
        userId,
      });
    }

    const totalRecords = await events.getMany();

    const eventsMapped = await events.take(limit).skip(offset).getMany();

    eventsMapped.map((event) => {
      console.log(event);
      event.state = state;
    });

    return { events: eventsMapped, totalRecords };
  }

  async update(eventId: string, updateEventInput: UpdateEventInput) {
    const event = await this.findOne(eventId);
    return this.eventsRepository.save({ ...event, ...updateEventInput });
  }

  async remove(eventId: string) {
    const event = await this.findOne(eventId);
    this.eventsRepository.remove(event);
    return event;
  }
}
