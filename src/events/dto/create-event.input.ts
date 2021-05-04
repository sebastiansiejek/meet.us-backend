import { InputType, Field } from '@nestjs/graphql';
import { event_type, state } from '../entities/event.entity';

@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  event_type: event_type;

  @Field()
  state: state;
}
