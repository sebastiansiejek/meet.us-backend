import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { LessThan, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Cron } from '@nestjs/schedule';
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
    query = '',
    status: IEventState,
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

    if (status === 'DURING') {
      events.andWhere('events.startDate <= :startDate', {
        startDate: currentDate,
      });
      events.andWhere('events.endDate >= :endDate', {
        endDate: currentDate,
      });
    }

    if (status === 'FUTURE') {
      events.andWhere('events.startDate > :startDate', {
        startDate: currentDate,
      });
    }

    if (status === 'PAST') {
      events.andWhere('events.startDate < :startDate', {
        startDate: currentDate,
      });
    }

    const totalRecords = await events.getMany();

    const eventsMapped = await events.take(limit).skip(offset).getMany();
    eventsMapped.map((event) => {
      event['state'] = status;
    });

    return { events: eventsMapped, totalRecords };
  }

  findUserEvents(
    limit: number,
    offset: number,
    field: string,
    sort: string,
    user: User,
    archive: boolean,
  ) {
    return this.eventsRepository.findAndCount({
      relations: ['user'],
      where: {
        isArchive: archive,
        user: {
          id: user.id,
        },
      },
      take: limit,
      skip: offset,
      order: {
        [field]: sort,
      },
    });
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

  @Cron('0 * * * *')
  async updateArchiveEvents() {
    const events = await this.eventsRepository.find({
      where: {
        isArchive: 0,
        startDate: LessThan(new Date()),
        endDate: LessThan(new Date()),
      },
    });
    for (const i in events) {
      const updateEvent = events[i];
      updateEvent.isArchive = true;
      await this.eventsRepository.save({ ...events[i], ...updateEvent });
    }
  }
}
