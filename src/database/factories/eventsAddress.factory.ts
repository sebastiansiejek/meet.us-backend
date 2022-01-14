import Faker from 'faker';
import { EventAddress } from './../../events/entities/event-address.entity';

import { define, factory } from 'typeorm-seeding';
import { Event } from 'src/events/entities/event.entity';

define(EventAddress, (faker: typeof Faker) => {
  const eventAddress = new EventAddress();
  eventAddress.label =
    faker.address.city() +
    ', ' +
    faker.address.state() +
    ', ' +
    faker.address.country();
  eventAddress.countryCode = faker.address.countryCode();
  eventAddress.countryName = faker.address.country();
  eventAddress.state = faker.address.state();
  eventAddress.county = faker.address.city();
  eventAddress.city = faker.address.city();
  eventAddress.postalCode = faker.address.zipCode();
  eventAddress.event = factory(Event)() as any;
  eventAddress.district = faker.address.city();

  return eventAddress;
});
