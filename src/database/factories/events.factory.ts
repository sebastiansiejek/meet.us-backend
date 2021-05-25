import Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { Event, eventType, state } from 'src/events/entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import {
  getRandomDateFromDate,
  getRandomKeyFromObject,
  getRandomValueFromArray,
} from 'utils/getRandoms';

define(Event, (faker: typeof Faker) => {
  const event = new Event();

  event.title = faker.name.title();
  event.description = faker.lorem.sentence();
  event.type = getRandomKeyFromObject(eventType);
  event.state = getRandomKeyFromObject(state);

  const today = new Date();
  const dates = [
    faker.date.past(),
    today,
    getRandomDateFromDate(today, 3, 20).endDate,
  ];
  const { startDate, endDate } = getRandomDateFromDate(
    getRandomValueFromArray(dates),
  );

  event.startDate = startDate;
  event.endDate = endDate;

  event.maxParticipants = faker.random.number(100);
  event.user = factory(User)() as any;

  return event;
});
