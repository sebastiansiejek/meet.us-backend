import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { actionType } from '../entities/userActivity.entity';

@ObjectType()
export default class UserActivityIdentifierSave {
  @Field(() => User)
  user: User;

  @Field()
  actionType: actionType;

  @Field()
  count: number;

  @Field()
  identifier: number;
}
