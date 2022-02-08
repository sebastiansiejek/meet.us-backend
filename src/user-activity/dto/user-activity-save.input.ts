import { Field, ObjectType } from '@nestjs/graphql';
import { eventType } from 'src/events/entities/event.entity';
import { User } from 'src/users/entities/user.entity';
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
  tag: string;

  @Field()
  count: number;

  @Field()
  score: number;

  @Field()
  weight: number;
}
