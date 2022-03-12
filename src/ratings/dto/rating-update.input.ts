import { InputType, Field } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class RatingUpdate {
  @Field()
  eventId: string;

  @Field()
  @Min(1)
  @Max(5)
  rate: number;
}
