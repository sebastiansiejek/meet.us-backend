import { InputType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';

@InputType()
export class ParticipantResponse {
  @Field()
  event: Event;

  @Field()
  user: User;

  @Field()
  type: Number;

  @Field()
  message: String;

}
