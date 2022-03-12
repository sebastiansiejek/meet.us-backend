import { ObjectType } from '@nestjs/graphql';
import relayTypes from '../../pagination/types/relay.types';
import { Participant } from '../entities/participant.entity';

@ObjectType()
export default class ParticipantListResponse extends relayTypes<Participant>(
  Participant,
) {}
