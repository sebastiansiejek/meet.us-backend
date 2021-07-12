import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ResetPasswordTokenInput {
  @Field()
  token: string;

  @Field()
  newPassword: string;

  @Field()
  confirmPassword: string;
}
