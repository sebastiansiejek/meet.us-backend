import { ObjectType } from '@nestjs/graphql';
import relayTypes from '../../pagination/types/relay.types';
import ParticipantByDateResponse from './participant-by-date.response';

@ObjectType()
export default class ParticipantByDateListResponse extends relayTypes<ParticipantByDateResponse>(
  ParticipantByDateResponse,
) {}
