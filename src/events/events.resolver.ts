import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

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

  @Query(() => [Event, User], { name: 'events' })
  async findAll() {
    return this.eventsService.findAll();
  }

  @Query(() => [Event], { name: 'event' })
  async findOne(@Args('id') eventId: string) {
    return this.eventsService.findOne(eventId);
  }

  @Query(() => [Event], { name: 'searchBar' })
  async searchBar(@Args('query') query: string) {
    return this.eventsService.searchBar(query);
  }

  @Query(() => [Event], { name: 'findUserEvents' })
  @UseGuards(GqlAuthGuard)
  findUserEvents(@CurrentUser() user: User) {
    return this.eventsService.findUserEvents(user);
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
