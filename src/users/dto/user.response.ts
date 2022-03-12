import { ObjectType } from '@nestjs/graphql';
import relayTypes from '../../pagination/types/relay.types';
import { User } from '../entities/user.entity';

@ObjectType()
export default class UserResponse extends relayTypes<User>(User) {}
