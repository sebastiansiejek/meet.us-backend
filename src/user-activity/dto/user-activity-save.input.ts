import { Field, ObjectType } from '@nestjs/graphql';
import { eventType } from '../../events/entities/event.entity';
import { User } from '../../users/entities/user.entity';
import { actionType } from '../entities/userActivity.entity';

@ObjectType()
export default class UserActivitySave {
  @Field(() => User)
  user: User;

  @Field()
  actionType: actionType;

  @Field()
  eventType: eventType;

  @Field()
  count: number;

  @Field()
  score: number;

  @Field()
  weight: number;
}
