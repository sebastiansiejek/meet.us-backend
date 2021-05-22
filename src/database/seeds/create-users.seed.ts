import { User } from 'src/users/entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(User)().createMany(10);
  }
}
