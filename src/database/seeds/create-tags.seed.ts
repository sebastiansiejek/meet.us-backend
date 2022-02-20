import { eventType } from '../../events/entities/event.entity';
import { Tag } from './../../tags/entities/tag.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

const tags = [
  'sport',
  'fitness',
  'gym',
  'workout',
  'motivation',
  'training',
  'fit',
  'bodybuilding',
  'lifestyle',
  'fitnessmotivation',
  'healthy',
  'travel',
  'photography',
  'health',
  'follow',
  'gymlife',
  'football',
  'boxing',
  'basketball',
  'fun',
  'muscle',
  'sportscenetr',
  'forest',
  'runing',
  'football',
];

export default class CreateTags implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const values = [];

    for (const tag of tags) {
      values.push({ type: eventType.Sport, name: tag });
      values.push({ type: eventType.Party, name: tag });
      values.push({ type: eventType.Social, name: tag });
    }

    await connection
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(values)
      .execute();
  }
}
