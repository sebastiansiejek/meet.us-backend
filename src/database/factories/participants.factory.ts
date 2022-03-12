import { Participant } from './../../participants/entities/participant.entity';
import { define, factory } from 'typeorm-seeding';
import { Event } from '../../events/entities/event.entity';
import { User } from '../../users/entities/user.entity';
import { getRandomNumberBetween } from 'utils/getRandoms';

define(Participant, () => {
  const participant = new Participant();
  participant.type = getRandomNumberBetween(1, 2);
  participant.user = factory(User)() as any;
  participant.event = factory(Event)() as any;
  return participant;
});
