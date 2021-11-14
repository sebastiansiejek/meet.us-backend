import { Participant } from './../../participants/entities/participant.entity';
import { define, factory } from 'typeorm-seeding';
import { Event } from 'src/events/entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import { getRandomNumberBetween } from 'utils/getRandoms';

define(Participant, () => {
  const participant = new Participant();
  participant.type = getRandomNumberBetween(1, 2);
  participant.user = factory(User)() as any;
  participant.event = factory(Event)() as any;
  return participant;
});
