import { InputType, Field } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

@InputType()
export class RatingResponse {
  @Field()
  event: Event;

  @Field()
  user: User;

  @Field()
  rate: number;
}
