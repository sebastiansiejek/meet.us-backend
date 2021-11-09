import { InputType, Field } from '@nestjs/graphql';
import { Matches, Length } from 'class-validator';

@InputType()
export class ResetPasswordTokenInput {
  @Field()
  token: string;

  @Field()
  @Length(8, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password should contains a capital letter and a number',
  })
  newPassword: string;

  @Field()
  @Length(8, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password should contains a capital letter and a number',
  })
  confirmPassword: string;
}
