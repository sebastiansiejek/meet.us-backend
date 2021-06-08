import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, Matches, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  @Length(4, 50)
  email?: string;

  @Field()
  @Length(8, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password should contains a capital letter and a number',
  })
  password?: string;
}
