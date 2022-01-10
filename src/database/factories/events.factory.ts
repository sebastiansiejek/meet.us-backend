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
  faker.locale = 'pl';
  const event = new Event();

  event.title = faker.name.title();
  event.description = faker.lorem.sentence();
  event.type = getRandomNumberBetween(0, 2);

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
  event.lat = parseFloat(faker.address.latitude(52.26, 52.2, 0.000001));
  event.lng = parseFloat(faker.address.longitude(19.58, 18.35, 0.000001));

  event.maxParticipants = faker.random.number(100);

  event.user = factory(User)() as any;

  return event;
});
