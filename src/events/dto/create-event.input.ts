import { InputType, Field, Int } from '@nestjs/graphql';
import { eventType } from '../entities/event.entity';

@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field({
    defaultValue: eventType.Party,
  })
  type: eventType;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  lat: number;

  @Field()
  lng: number;

  @Field(() => Int, { nullable: true })
  maxParticipants: number;
}
