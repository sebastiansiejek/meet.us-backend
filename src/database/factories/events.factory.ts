import Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { Event } from 'src/events/entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import {
  getRandomDateFromDate,
  getRandomNumberBetween,
  getRandomValueFromArray,
} from 'utils/getRandoms';

define(Event, (faker: typeof Faker) => {
  const event = new Event();

  event.title = faker.name.title();
  event.description = faker.lorem.sentence();
  event.type = getRandomNumberBetween(0, 1);

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
  event.lat = faker.random.number({ min: -90, max: 90, precision: 0.01 });
  event.lng = faker.random.number({ min: -180, max: 180, precision: 0.01 });

  event.maxParticipants = faker.random.number(100);
  event.user = factory(User)() as any;

  return event;
});
