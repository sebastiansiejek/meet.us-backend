import { InputType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';

@InputType()
export class RatingResponse {
  @Field()
  event: Event;

  @Field()
  user: User;

  @Field()
  rate: number;
}
