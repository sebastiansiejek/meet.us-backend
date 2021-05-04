import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';

@ObjectType()
export class AccessToken {
  @Field()
  access_token: string;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AccessToken)
  login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput;

    const user = new User();
    user.email = email;
    user.email = password;

    return this.authService.login(user as User);
  }
}
