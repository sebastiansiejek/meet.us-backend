import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from 'src/users/entities/user.entity';
import { getRandomBoolean } from 'utils/getRandoms';

define(User, (faker: typeof Faker) => {
  const user = new User();

  user.email = faker.internet.email();
  user.firstName = faker.name.firstName();
  user.isActive = getRandomBoolean();
  user.lastname = faker.name.lastName();
  user.nickname = faker.internet.userName();
  user.password = faker.internet.password();

  return user;
});
