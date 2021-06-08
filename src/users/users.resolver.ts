import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ActivateUserInput } from './dto/activate-user.input';
import { connectionFromArraySlice } from 'graphql-relay';
import ConnectionArgs from 'src/pagination/types/connection.args';
import UserResponse from './dto/user.response';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  activateUser(@Args('activateUser') activateUserInput: ActivateUserInput) {
    return this.usersService.activateUser(activateUserInput);
  }

  @Query(() => UserResponse, { name: 'users' })
  @UseGuards(GqlAuthGuard)
  async findAll(@Args() args: ConnectionArgs): Promise<UserResponse> {
    const { limit, offset } = args.pagingParams();
    const { field, sort } = args.orderParams();
    const [events, count] = await this.usersService.findAll(
      limit,
      offset,
      field,
      sort,
    );
    const page = connectionFromArraySlice(events, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @CurrentUser() user: User,
    @Args({
      name: 'id',
      nullable: true,
    })
    id: string,
  ) {
    return this.usersService.findOne(id ? id : user.id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  updateUser(
    @CurrentUser() user: User,
    @Args({
      name: 'updateUserInput',
    })
    updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(
      updateUserInput.id ? updateUserInput.id : user.id,
      updateUserInput,
    );
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  removeUser(@Args('id') id: string) {
    return this.usersService.remove(id);
  }
}
