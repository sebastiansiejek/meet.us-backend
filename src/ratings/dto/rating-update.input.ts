import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RatingUpdate {
  @Field()
  eventId: string;

  @Field()
  rate: number;
}
