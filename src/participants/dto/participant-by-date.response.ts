import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class ParticipantByDateResponse {
  @Field({ nullable: true })
  date: string;

  @Field({ nullable: true })
  count: number;
}
