import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCompanyInput {
  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  zipCode: string;

  @Field()
  city: string;

  @Field()
  nip: string;
}
