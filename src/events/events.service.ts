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
      // console.log('test');
      // console.log(distance);
      // console.log(userLat);
      // console.log(userLong);
      // console.log(events);
      // events.addSelect(`
      //         (ATAN(
      //           SQRT(
      //               POW(COS(RADIANS(${userLat})) * SIN(RADIANS(${userLong}) - RADIANS(-99.165660)), 2) +
      //               POW(COS(RADIANS(19.391124)) * SIN(RADIANS(${userLat})) -
      //              SIN(RADIANS(19.391124)) * cos(RADIANS(${userLat})) * cos(RADIANS(${userLong}) - RADIANS(-99.165660)), 2)
      //           )
      //           ,
      //           SIN(RADIANS(19.391124)) *
      //           SIN(RADIANS(${userLat})) +
      //           COS(RADIANS(19.391124)) *
      //           COS(RADIANS(${userLat})) *
      //           COS(RADIANS(${userLong}) - RADIANS(-99.165660))
      //         ) * 6371) as event_distance
      // `);
      // .where({ username: 'breckhouse0' })
      // events.addSelect(['100 as "distance"'])
      // 3959 * acos( cos( radians(6.414478) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(12.466646) ) + sin( radians(6.414478) ) * sin( radians( lat ) ) ) ) AS distance
      // .addSelect('DATE_DIFF(CURRENT_DATE(), employee.start_date) as "daysInEnterprise"')
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
      event['state'] = state;
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
