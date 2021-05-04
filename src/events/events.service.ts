import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  create(createEventInput: CreateEventInput) {
    return this.eventsRepository.save(createEventInput);
  }

  findAll() {
    return this.eventsRepository.find();
  }

  findOne(event_id: string) {
    return this.eventsRepository.findOneOrFail(event_id);
  }

  async update(event_id: string, updateEventInput: UpdateEventInput) {
    const event = await this.findOne(event_id);
    return this.eventsRepository.save({ ...event, ...updateEventInput });
  }

  async remove(event_id: string) {
    const event = await this.findOne(event_id);
    this.eventsRepository.remove(event);
    return event;
  }
}
