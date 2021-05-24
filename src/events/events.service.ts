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

  findAll() {
    return this.eventsRepository.find({
      relations: ['user'],
    });
  }

  findOne(eventId: string) {
    return this.eventsRepository.find({
      relations: ['user'],
      where: { id: eventId },
    });
  }

  searchBar(query: string) {
    return this.eventsRepository.find({
      relations: ['user'],
      where: [
        { title: ILike(`%${query}%`) },
        { description: ILike(`%${query}%`) },
      ],
    });
  }

  findUserEvents(user: User) {
    return this.eventsRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: user.id,
        },
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
