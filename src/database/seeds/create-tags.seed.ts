import { eventType } from 'src/events/entities/event.entity';
import { Tag } from './../../tags/entities/tag.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export default class CreateTags implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    this.seedSportTags(connection);
    this.seedEventTags(connection);
    this.seedSocialTags(connection);
  }
  private async seedSportTags(connection: Connection) {
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

    const values = [];
    for (const tag of tags) {
      values.push({ type: eventType.Sport, name: tag });
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(values)
      .execute();
  }
  private async seedSocialTags(connection: Connection) {
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

    const values = [];
    for (const tag of tags) {
      values.push({ type: eventType.Social, name: tag });
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(values)
      .execute();
  }
  private async seedEventTags(connection: Connection) {
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

    const values = [];
    for (const tag of tags) {
      values.push({ type: eventType.Party, name: tag });
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(values)
      .execute();
  }
}
