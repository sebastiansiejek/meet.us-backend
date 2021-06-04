import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ActivateUserInput } from './dto/activate-user.input';

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

  @Query(() => [User], { name: 'users' })
  @UseGuards(GqlAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GqlAuthGuard)
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
