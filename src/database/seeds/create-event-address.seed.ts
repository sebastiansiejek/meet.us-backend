import { EventAddress } from './../../events/entities/event-address.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateEventAddress implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(EventAddress)().createMany(40);
  }
}
