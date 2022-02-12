import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { actionType } from '../entities/userActivity.entity';

@ObjectType()
export default class UserActivityTagSave {
  @Field(() => User)
  user: User;

  @Field()
  actionType: actionType;

  @Field()
  tag: string;

  @Field()
  count: number;

  @Field()
  score: number;

  @Field()
  weight: number;
}
