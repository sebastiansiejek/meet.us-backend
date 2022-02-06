import { Tag } from './../../tags/entities/tag.entity';
import { CreateEventAddressInput } from './create-event-address.input';
import { InputType, Field, Int } from '@nestjs/graphql';
import { eventType } from '../entities/event.entity';
import GraphQLJSON from 'graphql-type-json';

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

  @Field(() => GraphQLJSON, {
    nullable: true,
  })
  tags: Tag[];

  @Field()
  eventAddress: CreateEventAddressInput;

  @Field(() => Int, { nullable: true })
  maxParticipants: number;
}
