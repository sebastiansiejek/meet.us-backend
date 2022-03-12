import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../users/entities/user.entity';
import { getRandomBoolean, getRandomNumberBetween } from 'utils/getRandoms';

define(User, (faker: typeof Faker) => {
  faker.locale = 'pl';
  const user = new User();

  user.email = faker.internet.email();
  user.firstName = faker.name.firstName();
  user.isActive = getRandomBoolean();
  user.lastname = faker.name.lastName();
  user.nickname = faker.internet.userName();
  user.password = faker.internet.password();
  user.description = faker.lorem.word(25);
  user.sex = getRandomNumberBetween(0, 1);

  return user;
});
