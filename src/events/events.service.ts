import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Image } from '../images/entities/image.entity';
import { Repository } from 'typeorm';
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
      relations: ['user', 'image'],
    });
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
  async addImage(id: string, image: Image) {
    const event = await this.eventsRepository.findOne(id);
    event.image = image;
    return await this.eventsRepository.save(event);
  }
}
