import { EventAddress } from './entities/event-address.entity';
import { Participant } from './../participants/entities/participant.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { IEventState } from './IEvents';
import { CreateEventAddressInput } from './dto/create-event-address.input';
import { UserActivityService } from 'src/user-activity/user-activity.service';
import { UsersService } from 'src/users/users.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(EventAddress)
    private readonly eventAddressRepository: Repository<EventAddress>,
    private readonly userActivityService: UserActivityService,
    private readonly userService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  async create(createEventInput: CreateEventInput, user: User) {
    const event = await this.eventsRepository.save({
      ...createEventInput,
      user,
    });

    const address = await this.saveAddress(
      event,
      createEventInput.eventAddress,
    );
    event.eventAddress = address;

    return event;
  }

  async findForEdit(eventId: string, userId: string) {
    const event = await this.findOne(eventId);

    const user = await this.userService.findOne(userId);

    if (event.user.id != user.id) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.USER_IS_NOT_OWNER_OF_EVENT'),
      );
    }

    return await event;
  }

  async find(eventId: string, userId: string) {
    const event = this.eventsRepository
      .createQueryBuilder('events')
      .innerJoinAndMapOne(
        'events.user',
        User,
        'users',
        'events.user = users.id',
      )
      .innerJoinAndMapOne(
        'events.eventAddress',
        EventAddress,
        'event_address',
        'events.id = event_address.event',
      );
    let user;
    if (userId) {
      user = await this.userService.findOne(userId);
      event
        .leftJoinAndMapOne(
          'events.loggedInParticipants',
          Participant,
          'loggedInParticipants',
          `events.id = loggedInParticipants.event and loggedInParticipants.user = "${user.id}"`,
        )
        .leftJoinAndMapOne(
          'loggedInParticipants.user',
          User,
          'u2',
          'loggedInParticipants.user = u2.id',
        );
    }

    event.andWhere(`events.id = '${eventId}'`);
    const searchedEvent = await event.getOne();

    if (userId) {
      this.userActivityService.saveEventView(user, searchedEvent);
    }
    this.saveVisit(searchedEvent);

    return searchedEvent;
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
    loggedUser: string,
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
      .leftJoinAndMapMany(
        'events.participants',
        Participant,
        'participants',
        'events.id = participants.event',
        { limit: '2' },
      )
      .leftJoinAndMapOne(
        'events.eventAddress',
        EventAddress,
        'event_address',
        'events.id = event_address.event',
      )
      .leftJoinAndMapOne(
        'participants.user',
        User,
        'u',
        'participants.user = u.id',
      )
      .loadRelationCountAndMap(
        'events.interestedCount',
        'events.participants',
        'p',
        (qb) => qb.andWhere('p.type = 1'),
      )
      .loadRelationCountAndMap(
        'events.goingCount',
        'events.participants',
        'p',
        (qb) => qb.andWhere('p.type = 2'),
      )
      .where(
        '(events.title like  :title or events.description like :description)',
        { title: `%${query}%`, description: `%${query}%` },
      );
    if (loggedUser) {
      const user = await this.userService.findOne(loggedUser);
      events
        .leftJoinAndMapOne(
          'events.loggedInParticipants',
          Participant,
          'loggedInParticipants',
          `events.id = loggedInParticipants.event and loggedInParticipants.user = "${user.id}"`,
        )
        .leftJoinAndMapOne(
          'loggedInParticipants.user',
          User,
          'u2',
          'loggedInParticipants.user = u2.id',
        );
    }
    let distanceQuery = '0';
    if (distance && latitude && longitude) {
      events.addSelect(
        `ROUND( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( events.lat ) ) * cos( radians( events.lng ) - radians(${longitude}) ) + sin( radians(${latitude}) )* sin( radians( events.lat ) ) ) ,2)`,
        'events_distance',
      );

      events.andWhere(
        `ROUND( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( events.lat ) ) * cos( radians( events.lng ) - radians(${longitude}) ) + sin( radians(${latitude}) )* sin( radians( events.lat ) ) ) ,2) <= :userDistanceLimit`,
        { userDistanceLimit: distance },
      );

      distanceQuery = `ROUND( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( events.lat ) ) * cos( radians( events.lng ) - radians(${longitude}) ) + sin( radians(${latitude}) )* sin( radians( events.lat ) ) ) ,2) <= ${distance}`;
      if (userId) {
        this.userActivityService.saveDistanceSerchedQuery(userId, distance);
      }
    }
    if (loggedUser) {
      const user = await this.userService.findOne(loggedUser);
      const activity = await this.userActivityService.generateQuery(
        user,
        distanceQuery,
      );

      events.addSelect(`${activity}`, 'events_score');
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
    } else if (field == 'score') {
      if (loggedUser) {
        events.orderBy(`events_score`, 'ASC' == sort ? 'ASC' : 'DESC');
      } else {
        events.orderBy(`events.startDate`, 'ASC');
      }
    } else {
      events.orderBy(`events.${field}`, 'ASC' == sort ? 'ASC' : 'DESC');
    }

    const eventsMapped = await events.take(limit).skip(offset).getMany();

    eventsMapped.map((event) => {
      event.state = state;
    });

    return { events: eventsMapped, totalRecords };
  }

  async update(
    user: User,
    eventId: string,
    updateEventInput: UpdateEventInput,
  ) {
    const event = await this.findOne(eventId);
    const loggedUser = await this.userService.findOne(user.id);

    if (event.user.id != loggedUser.id) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.USER_IS_NOT_OWNER_OF_EVENT'),
      );
    }

    const updatedEvent = await this.eventsRepository.save({
      ...event,
      ...updateEventInput,
    });

    const address = await this.updateAddress(
      event,
      updateEventInput.eventAddress,
    );

    updatedEvent.eventAddress = address;

    return updatedEvent;
  }

  async remove(eventId: string) {
    const event = await this.findOne(eventId);
    this.eventsRepository.remove(event);
    return event;
  }

  async saveAddress(event: Event, eventAddress: CreateEventAddressInput) {
    return await this.eventAddressRepository.save({
      ...eventAddress,
      event,
    });
  }

  async updateAddress(event: Event, eventAddress: CreateEventAddressInput) {
    const address = await this.eventAddressRepository.findOne({
      where: { event: event.id },
    });

    return this.eventAddressRepository.save({ ...address, ...eventAddress });
  }

  async updateRate(eventId: any, rate: number) {
    const event = await this.findOne(eventId.id);
    const updateEvent = event;
    updateEvent.rate = rate;

    await this.eventsRepository.save({
      ...event,
      ...updateEvent,
    });
  }

  saveVisit(searchedEvent: Event) {
    this.eventsRepository
      .createQueryBuilder()
      .update(Event)
      .set({
        visitCount: () => 'visitCount + 1',
      })
      .where('id = :id', { id: searchedEvent.id })
      .execute();
  }
}
