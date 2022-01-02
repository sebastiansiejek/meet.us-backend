import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import EventResponse from './dto/event.response';
import ConnectionArgs from 'src/pagination/types/connection.args';
import { connectionFromArraySlice } from 'graphql-relay';
import { IEventState } from './IEvents';

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  createEvent(
    @CurrentUser() user: User,
    @Args('createEventInput') createEventInput: CreateEventInput,
  ) {
    return this.eventsService.create(createEventInput, user);
  }

  @Query(() => Event, { name: 'event' })
  async findOne(@Args('id') eventId: string) {
    return this.eventsService.findOne(eventId);
  }

  @Query(() => EventResponse)
  async events(
    @CurrentUser() user: User,
    @Args() args: ConnectionArgs,
    @Args({ name: 'query', defaultValue: '' }) query: string,
    @Args({ name: 'state', nullable: true }) state: IEventState,
    @Args({ name: 'userId', nullable: true }) userId: string,
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
      user,
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
  @UseGuards(GqlAuthGuard)
  async userLoggedEvents(
    @CurrentUser() user: User,
    @Args() args: ConnectionArgs,
    @Args({ name: 'query', defaultValue: '' }) query: string,
    @Args({ name: 'state', nullable: true }) state: IEventState,
    @Args({ name: 'userId', nullable: true }) userId: string,
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
      user,
    );
    const events = records.events;
    const count = records.totalRecords.length;
    const page = connectionFromArraySlice(events, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  removeEvent(@Args('id') eventId: string) {
    return this.eventsService.remove(eventId);
  }
}
