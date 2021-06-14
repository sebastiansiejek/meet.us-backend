import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import {
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
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

  findAll(
    limit: number,
    offset: number,
    field: string,
    sort: string,
    archive: boolean,
  ): Promise<[Event[], number]> {
    return this.eventsRepository.findAndCount({
      relations: ['user'],
      take: limit,
      skip: offset,
      order: {
        [field]: sort,
      },
      where: {
        isArchive: archive,
      },
    });
  }

  findOne(eventId: string) {
    return this.eventsRepository.findOne({
      relations: ['user'],
      where: { id: eventId },
    });
  }

  async searchBar(
    limit: number,
    offset: number,
    field: string,
    sort: string,
    query: string,
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
      .andWhere(
        '(events.title like  :title or events.description like :description)',
        { title: `%${query}%`, description: `%${query}%` },
      )
      .orderBy(`events.${field}`, 'ASC' == sort ? 'ASC' : 'DESC')
      .take(limit)
      .skip(offset);

    if (status === 'DURING') {
      events.where({
        startDate: LessThanOrEqual(currentDate),
        endDate: MoreThanOrEqual(currentDate),
      });
    }

    if (status === 'FUTURE') {
      events.where(status === 'FUTURE' && 'events.startDate > :startDate', {
        startDate: currentDate,
      });
    }

    if (status === 'PAST') {
      events.where(status === 'PAST' && 'events.startDate < :startDate', {
        startDate: currentDate,
      });
    }

    const totalRecords = await this.eventsRepository
      .createQueryBuilder('events')
      .innerJoinAndMapOne(
        'events.user',
        User,
        'users',
        'events.user = users.id',
      )
      .andWhere(
        '(events.title like  :title or events.description like :description)',
        { title: `%${query}%`, description: `%${query}%` },
      )
      .orderBy(`events.${field}`, 'ASC' == sort ? 'ASC' : 'DESC')
      .getMany();

    const eventsMapped = await events.getMany();
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
