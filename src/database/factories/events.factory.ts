import Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { Event, eventType, state } from 'src/events/entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import { getRandomKeyFromObject } from 'utils/getRandoms';

define(Event, (faker: typeof Faker) => {
  const event = new Event();

  event.title = faker.name.title();
  event.description = faker.lorem.text();
  event.type = getRandomKeyFromObject(eventType);
  event.state = getRandomKeyFromObject(state);
  event.startDate = faker.date.past();
  event.endDate = faker.date.future();
  event.user = factory(User)() as any;

  return event;
});
