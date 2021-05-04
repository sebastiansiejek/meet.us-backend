import { UseGuards } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ObjectType()
export class AccessToken {
  @Field()
  access_token: string;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AccessToken)
  @UseGuards(LocalAuthGuard)
  login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    
    const user = new User();
    user.email = loginUserInput.email;
    user.password = loginUserInput.password;

    return  this.authService.login(user as User);
  }
}
