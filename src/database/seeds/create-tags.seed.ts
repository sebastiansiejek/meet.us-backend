import { eventType } from 'src/events/entities/event.entity';
import { Tag } from './../../tags/entities/tag.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

const tagsSport = [
  'sport',
  'fitness',
  'gym',
  'workout',
  'training',
  'fit',
  'bodybuilding',
  'healthy',
  'travel',
  'health',
  'follow',
  'gymlife',
  'football',
  'boxing',
  'basketball',
  'fun',
  'muscle',
  'sportscenter',
  'forest',
  'runing',
  'football',
  'league',
  'professional',
  'skill',
  'teammates',
  'tournament',
  'athlete',
  'golf',
  'tennis',
  'squash',
  'swimming',
  'sailing',
  'weightlifting',
  'table tennis',
  'outdoor',
  'indoor',
  'cycling',
  'krate',
  'mma',
  'skiing',
  'snowboard',
  'surfing',
  'amateur',
  'semi-pro',
  'ball',
  'badminton',
  'throw',
  'walker',
  'walk',
  'goal',
  'summer',
];

const tagsParty = [
  'party',
  'music',
  'love',
  'dj',
  'birthday',
  'dance',
  'wedding',
  'fun',
  'friends',
  'happy',
  'nightlife',
  'club',
  'hiphop',
  'partytime',
  'fashion',
  'food',
  'drinks',
  'summer',
  'happybirthday',
  'night',
  'drinks',
  'rap',
  'hiphop',
  'live',
  'balloons',
  'partymusic',
  'partying',
  'dress',
  'outfit',
  'partyanimal',
  'food',
  'girls',
  'boys',
  'partytime',
  'makeup',
  'partyhard',
  'trap',
  'metal',
  'classic music',
  'dubstep',
  'beautiful',
  'fashion',
  'dresscode',
  'dancehall',
  'nightlife',
  'fun',
  'happy',
  'travel',
  'outdoor',
  'indoor',
];

const tagsSocial = [
  'sport',
  'love',
  'like',
  'happy',
  'art',
  'design',
  'fashion',
  'digital',
  'fun',
  'music',
  'media',
  'flirting',
  'mood',
  'date',
  'datenight',
  'meet',
  'drinks',
  'smart',
  'pub',
  'bar',
  'social',
  'friends',
  'spontaneous',
  'friendly',
  'boy',
  'boys',
  'girl',
  'girls',
  'party',
  'event',
  'game',
  'billiard',
  'cinema',
  'lecture',
  'exposure',
  'opera',
  'theatre',
  'karts',
  'inside',
  'outside',
  'park',
  'center',
  'socialization',
  'stand up',
  'fighting',
  'sea',
  'Lake',
  'queue',
  'rope park',
  'a blind date',
];
export default class CreateTags implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const values = [];

    for (const tag of tagsSport) {
      values.push({ type: eventType.Sport, name: tag });
    }

    for (const tag of tagsParty) {
      values.push({ type: eventType.Party, name: tag });
    }

    for (const tag of tagsSocial) {
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
