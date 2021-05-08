import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  create(createEventInput: CreateEventInput, user: User) {
    const createEvent = new Event();
    createEvent.description = createEventInput.description;
    createEvent.title = createEventInput.title;
    createEvent.state = createEventInput.state;
    createEvent.type = createEventInput.type;
    createEvent.startDate = createEventInput.startDate;
    createEvent.endDate = createEventInput.endDate;
    createEvent.user = user;

    return this.eventsRepository.save(createEvent);
  }

  findAll() {
    return this.eventsRepository.find();
  }

  findOne(eventId: string) {
    return this.eventsRepository.findOneOrFail(eventId);
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
