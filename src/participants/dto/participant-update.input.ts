import { InputType, Field } from '@nestjs/graphql';
import { participationType } from '../entities/participant.entity';

@InputType()
export class ParticipantUpdate {
  @Field()
  eventId: string;

  @Field()
  type: participationType;
}
