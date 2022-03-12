import { ObjectType } from '@nestjs/graphql';
import relayTypes from '../../pagination/types/relay.types';
import { Event } from '../entities/event.entity';

@ObjectType()
export default class EventResponse extends relayTypes<Event>(Event) {}
