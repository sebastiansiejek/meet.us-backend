import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ActivateUserInput {
  @Field()
  token?: string;
}
