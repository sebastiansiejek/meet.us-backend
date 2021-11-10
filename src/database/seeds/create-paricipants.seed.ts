import { Participant } from './../../participants/entities/participant.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateParticipants implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(Participant)().createMany(60);
  }
}
