import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

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
  ): Promise<[Event[], number]> {
    return this.eventsRepository.findAndCount({
      relations: ['user'],
      take: limit,
      skip: offset,
      order: {
        [field]: sort,
      },
    });
  }

  orderColumns() {
    const test = this.eventsRepository.metadata;
    console.log(test.propertiesMap);
    return test;
  }

  findOne(eventId: string) {
    return this.eventsRepository.findOne({
      relations: ['user'],
      where: { id: eventId },
    });
  }

  searchBar(
    limit: number,
    offset: number,
    field: string,
    sort: string,
    query: string,
  ) {
    return this.eventsRepository.findAndCount({
      relations: ['user'],
      where: [
        { title: ILike(`%${query}%`) },
        { description: ILike(`%${query}%`) },
      ],
      take: limit,
      skip: offset,
      order: {
        [field]: sort,
      },
    });
  }

  findUserEvents(
    limit: number,
    offset: number,
    field: string,
    sort: string,
    user: User,
  ) {
    return this.eventsRepository.findAndCount({
      relations: ['user'],
      where: {
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
}
