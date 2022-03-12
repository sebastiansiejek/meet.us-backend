import { eventType } from '../events/entities/event.entity';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import EventResponse from './dto/event.response';
import ConnectionArgs from '../pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import { IEventState } from './IEvents';
import { I18nLang } from 'nestjs-i18n';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Event)
  createEvent(
    @CurrentUser() user: User,
    @Args('createEventInput') createEventInput: CreateEventInput,
  ) {
    return this.eventsService.create(createEventInput, user);
  }

  @Query(() => Event, { name: 'event' })
  async findOne(
    @Args('id') eventId: string,
    @Args({ name: 'userId', nullable: true }) userId: string,
  ) {
    return this.eventsService.find(eventId, userId);
  }

  @Query(() => EventResponse)
  async events(
    @Args() args: ConnectionArgs,
    @Args({ name: 'query', defaultValue: '' }) query: string,
    @Args({ name: 'state', nullable: true }) state: IEventState,
    @Args({ name: 'type', nullable: true }) type: eventType,
    @Args({ name: 'userId', nullable: true }) userId: string,
    @Args({ name: 'clientDate', nullable: true, description: 'UNIX' })
    clientDate: number,
  ): Promise<EventResponse> {
    const { limit, offset } = args.pagingParams();
    const { field, sort } = args.orderParams();
    const { distance, latitude, longitude } = args.distanceParams();
    const records = await this.eventsService.findAll(
      limit,
      offset,
      field,
      sort,
      query,
      state,
      null,
      distance,
      latitude,
      longitude,
      userId,
      type,
      clientDate,
    );
    const events = records.events;
    const count = records.totalRecords.length;
    const page = connectionFromArraySlice(events, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => EventResponse)
  async userEvents(
    @Args() args: ConnectionArgs,
    @Args({ name: 'query', defaultValue: '' }) query: string,
    @Args({ name: 'state', nullable: true }) state: IEventState,
    @Args({ name: 'type', nullable: true }) type: eventType,
    @Args({ name: 'userId', nullable: false }) userId: string,
  ): Promise<EventResponse> {
    const { limit, offset } = args.pagingParams();
    const { field, sort } = args.orderParams();
    const { distance, latitude, longitude } = args.distanceParams();
    const records = await this.eventsService.findAll(
      limit,
      offset,
      field,
      sort,
      query,
      state,
      userId,
      distance,
      latitude,
      longitude,
      null,
      type,
    );
    const events = records.events;
    const count = records.totalRecords.length;
    const page = connectionFromArraySlice(events, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => EventResponse)
  async userEventsCalendar(
    @Args() args: ConnectionArgs,
    @Args({ name: 'query', defaultValue: '' }) query: string,
    @Args({ name: 'type', nullable: true }) type: eventType,
    @Args({ name: 'userId', nullable: false }) userId: string,
    @Args({ name: 'startDate', nullable: false }) startDate: Date,
    @Args({ name: 'endDate', nullable: false }) endDate: Date,
  ): Promise<EventResponse> {
    const { limit, offset } = args.pagingParams();
    const { field, sort } = args.orderParams();
    const records = await this.eventsService.findAllForCalendar(
      limit,
      offset,
      field,
      sort,
      query,
      userId,
      type,
      startDate,
      endDate,
    );
    const events = records.events;
    const count = records.totalRecords.length;
    const page = connectionFromArraySlice(events, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => Event)
  @UseGuards(GqlAuthGuard)
  findForEdit(
    @CurrentUser() user: User,
    @Args('id') eventId: string,
    @I18nLang() lang: string,
  ) {
    return this.eventsService.findForEdit(eventId, user.id, lang);
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  updateEvent(
    @CurrentUser() user: User,
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
    @I18nLang() lang: string,
  ) {
    return this.eventsService.update(
      user,
      updateEventInput.id,
      updateEventInput,
      lang,
    );
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  removeEvent(@Args('id') eventId: string) {
    return this.eventsService.remove(eventId);
  }
}
