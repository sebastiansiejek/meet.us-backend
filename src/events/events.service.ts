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
    latitude: number,
    longitude: number,
  ) {
    const currentDate = new Date().toISOString().replace('T', ' ');

    //TODO do events trzeba dodać left join dla paricipantow 
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
      );

    if (distance && latitude && longitude) {
      events.addSelect(
        `ROUND( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( events.lat ) ) * cos( radians( events.lng ) - radians(${longitude}) ) + sin( radians(${latitude}) )* sin( radians( events.lat ) ) ) ,2)`,
        'events_distance',
      );
      events.andWhere(
        `ROUND( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( events.lat ) ) * cos( radians( events.lng ) - radians(${longitude}) ) + sin( radians(${latitude}) )* sin( radians( events.lat ) ) ) ,2) <= :userDistanceLimit`,
        { userDistanceLimit: distance },
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

    if (distance && latitude && longitude && field == 'distance') {
      events.orderBy(`events_distance`, 'ASC' == sort ? 'ASC' : 'DESC');
    } else {
      events.orderBy(`events.${field}`, 'ASC' == sort ? 'ASC' : 'DESC');
    }

    const eventsMapped = await events.take(limit).skip(offset).getMany();
    console.log(eventsMapped);

    eventsMapped.map((event) => {
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
