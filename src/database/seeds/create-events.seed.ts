import { Event } from 'src/events/entities/event.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateEvents implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Event)().createMany(10);
  }
}
