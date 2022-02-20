import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  Query,
} from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginUserInput } from './dto/login-user.input';
import { RefreshUserToken } from './dto/refresh-user-token.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ObjectType()
export class AccessToken {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  accessTokenExpires: number;

  @Field()
  user: User;
}
@ObjectType()
export class isValid {
  @Field()
  isValid: boolean;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AccessToken)
  @UseGuards(LocalAuthGuard)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    const user = new User();
    user.email = loginUserInput.email;
    user.password = loginUserInput.password;

    return await this.authService.login(user);
  }

  @Mutation(() => AccessToken)
  @UseGuards(GqlAuthGuard)
  async refresh(
    @CurrentUser() user: User,
    @Args('refreshToken') refreshToken: RefreshUserToken,
  ) {
    return await this.authService.refreshLoginToken(user, refreshToken.token);
  }

  @Query(() => isValid)
  @UseGuards(GqlAuthGuard)
  async tokenIsValid(@CurrentUser() user: User) {
    if (!user) return { isValid: false };

    return { isValid: true };
  }
}
