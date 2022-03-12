import { ParticipantsModule } from './../participants/participants.module';
import { RatingsResolver } from './ratings.resolver';
import { Rating } from './entities/rating.entity';
import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { UserActivityModule } from '../user-activity/user-activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating]),
    EventsModule,
    UsersModule,
    ParticipantsModule,
    UserActivityModule,
  ],
  providers: [RatingsService, RatingsResolver],
})
export class RatingsModule {}
