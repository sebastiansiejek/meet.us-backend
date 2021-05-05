import { InputType, Field } from '@nestjs/graphql';
import { eventType, state } from '../entities/event.entity';

@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  eventType: eventType;

  @Field()
  state: state;
}
