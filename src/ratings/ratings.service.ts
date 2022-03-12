import { ParticipantsService } from './../participants/participants.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { Event } from '../events/entities/event.entity';
import { EventsService } from '../events/events.service';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { RatingResponse } from './dto/rating-response.input';
import { Rating } from './entities/rating.entity';
import { UserActivityService } from '../user-activity/user-activity.service';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    private readonly eventsService: EventsService,
    private readonly participantsService: ParticipantsService,
    private readonly i18n: I18nService,
    private readonly userActivityService: UserActivityService,
  ) {}

  async rateEvent(
    eventId: string,
    user: User,
    rate: number,
    @I18nLang() lang: string,
  ): Promise<RatingResponse> {
    const event = await this.eventsService.findOne(eventId);

    if (!event) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.EVENT_NOT_FOUND', { lang }),
      );
    }
    const endDate = new Date(event.endDate);
    const today = new Date();

    if (endDate > today) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.EVENT_IS_NOT_OVER', { lang }),
      );
    }

    const participate = await this.participantsService.find(user, event);

    if (!participate) {
      throw new BadRequestException(
        await this.i18n.translate(
          'errors.ERROR.USER_NOT_PARTICIPATE_IN_EVENT',
          { lang },
        ),
      );
    }

    if (rate == 0) {
      await this.removeRateFromEvent(user, event);
    } else {
      if (rate > 5) rate = 5;

      await this.addRateToEvent(user, event, rate);
    }

    const rateResponse: RatingResponse = {
      user: user,
      event: event,
      rate: rate,
    };

    return rateResponse;
  }
  async removeRateFromEvent(user: User, event: Event) {
    const participantRemove = await this.find(user, event);
    const result = await this.ratingRepository.remove(participantRemove);

    return result;
  }

  addRateToEvent(user: User, event: Event, rate: number) {
    let rating = this.find(user, event);
    if (!rating) {
      rating = this.create(user, event, rate);
    } else {
      rating = this.update(user, event, rate);
    }
  }

  create(user: User, event: any, rate: number) {
    const rating = this.ratingRepository.save({
      rate: rate,
      user: user,
      event: event,
    });

    this.updateRate(event);

    this.userActivityService.saveRateActivity(rate, user, event);

    return rating;
  }

  find(user: User, event: any) {
    const rating = this.ratingRepository.findOne({
      relations: ['user', 'event'],
      where: { event: event, user: user },
    });
    return rating;
  }

  async update(user: User, event: any, rate: number) {
    const rating = await this.find(user, event);
    const update = await this.ratingRepository.create({
      rate: rate,
      user: user,
      event: event,
    });

    const result = await this.ratingRepository.save({
      ...rating,
      ...update,
    });

    this.userActivityService.saveRateActivity(rate, user, event);

    this.updateRate(event);

    return result;
  }

  async removeUserFromEvent(user: User, event: Event) {
    const rateRemove = await this.find(user, event);
    const result = await this.ratingRepository.remove(rateRemove);

    return result;
  }

  async findAll(
    limit: number,
    offset: number,
    field: string,
    sort: string,
    eventId: string,
    userId: string,
    query: string,
  ) {
    const ratings = this.ratingRepository
      .createQueryBuilder('ratings')
      .innerJoinAndMapOne(
        'ratings.user',
        User,
        'users',
        'ratings.user = users.id',
      )
      .innerJoinAndMapOne(
        'ratings.event',
        Event,
        'events',
        'ratings.event = events.id',
      );

    if (query) {
      ratings.andWhere(
        '(events.title like  :title or events.description like :description)',
        { title: `%${query}%`, description: `%${query}%` },
      );
    }

    if (userId) {
      ratings.andWhere('(ratings.user = :id)', { id: userId });
    }

    if (eventId) {
      ratings.andWhere('(ratings.event = :id)', { id: eventId });
    }

    ratings.orderBy(`ratings.${field}`, 'ASC' == sort ? 'ASC' : 'DESC');

    const totalRecords = await ratings.getMany();
    const ratingsMapped = await ratings.take(limit).skip(offset).getMany();

    return { ratings: ratingsMapped, totalRecords };
  }

  async updateRate(event: any) {
    const [ratings, count] = await this.ratingRepository.findAndCount({
      relations: ['event'],
      where: { event: event },
    });

    let sum = 0;
    for (const rating of ratings) {
      sum += rating.rate;
    }

    const rate = sum / count;

    await this.eventsService.updateRate(event, rate);
  }
}
