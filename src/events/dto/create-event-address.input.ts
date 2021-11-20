import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventAddressInput {
  @Field()
  label: string;

  @Field()
  countryCode: string;

  @Field()
  countryName: string;

  @Field()
  state: string;

  @Field()
  county: string;

  @Field()
  city: string;

  @Field()
  district: string;

  @Field()
  postalCode: string;
}
