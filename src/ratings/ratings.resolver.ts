import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { connectionFromArraySlice } from 'graphql-relay';
import { CurrentUser } from '../auth/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import ConnectionArgs from '../pagination/types/connection.args';
import { User } from '../users/entities/user.entity';

import RatingListResponse from './dto/rating-list.response';
import { RatingUpdate } from './dto/rating-update.input';
import { RatingResponse } from './dto/rating-response.input';
import { I18nLang } from 'nestjs-i18n';

@Resolver()
export class RatingsResolver {
  constructor(private readonly ratingsService: RatingsService) {}

  @Mutation(() => Rating)
  @UseGuards(GqlAuthGuard)
  rateEvent(
    @CurrentUser() user: User,
    @Args('rateEvent') ratingUpdate: RatingUpdate,
    @I18nLang() lang: string,
  ): Promise<RatingResponse> {
    return this.ratingsService.rateEvent(
      ratingUpdate.eventId,
      user,
      ratingUpdate.rate,
      lang,
    );
  }

  @Query(() => RatingListResponse, { name: 'ratingsEvents' })
  async ratingsEvents(
    @Args() args: ConnectionArgs,
    @Args('eventId', { nullable: true }) eventId: string,
    @Args('userId', { nullable: true }) userId: string,
    @Args('query', { nullable: true }) query: string,
  ): Promise<RatingListResponse> {
    const { limit, offset } = args.pagingParams();
    const { field, sort } = args.orderParams();
    const records = await this.ratingsService.findAll(
      limit,
      offset,
      field,
      sort,
      eventId,
      userId,
      query,
    );
    const ratings = records.ratings;
    const count = records.totalRecords.length;

    const page = connectionFromArraySlice(ratings, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }

  @Query(() => RatingListResponse, { name: 'userRates' })
  @UseGuards(GqlAuthGuard)
  async userRates(
    @CurrentUser() user: User,
    @Args() args: ConnectionArgs,
    @Args('query', { nullable: true }) query: string,
  ): Promise<RatingListResponse> {
    const { limit, offset } = args.pagingParams();
    const { field, sort } = args.orderParams();
    const records = await this.ratingsService.findAll(
      limit,
      offset,
      field,
      sort,
      null,
      user.id,
      query,
    );
    const ratings = records.ratings;
    const count = records.totalRecords.length;

    const page = connectionFromArraySlice(ratings, args, {
      arrayLength: count,
      sliceStart: offset || 0,
    });

    return { page, pageData: { count, limit, offset } };
  }
}
