import { Rating } from './../entities/rating.entity';
import { ObjectType } from '@nestjs/graphql';
import relayTypes from 'src/pagination/types/relay.types';

@ObjectType()
export default class RatingListResponse extends relayTypes<Rating>(Rating) {}
