import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { ActivateUserInput } from './dto/activate-user.input';
import { connectionFromArraySlice } from 'graphql-relay';
import ConnectionArgs from '../pagination/types/connection.args';
import UserResponse from './dto/user.response';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ResetPasswordTokenInput } from './dto/reset-password-token.input';
import { I18nLang } from 'nestjs-i18n';

@ObjectType()
export class ResetResponse {
  @Field()
  message: string;
}

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @I18nLang() lang: string,
  ) {
    return this.usersService.create(createUserInput, lang);
  }

  @Mutation(() => User)
  activateUser(@Args('activateUser') activateUserInput: ActivateUserInput) {
    return this.usersService.activateUser(activateUserInput);
  }

  @Query(() => UserResponse, { name: 'users' })
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
  findOne(@Args('id') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Query(() => User, { name: 'currentUser' })
  @UseGuards(GqlAuthGuard)
  currentUser(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
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

  @Mutation(() => ResetResponse)
  resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
    @I18nLang() lang: string,
  ) {
    return this.usersService.resetPassword(resetPasswordInput.email, lang);
  }

  @Mutation(() => ResetResponse)
  confirmResetPassword(
    @Args('confirmResetPassword')
    resetPasswordTokenInput: ResetPasswordTokenInput,
    @I18nLang() lang: string,
  ) {
    return this.usersService.resetPasswordToken(resetPasswordTokenInput, lang);
  }
}
