import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventAddress } from './entities/event-address.entity';
import { UserActivityModule } from 'src/user-activity/user-activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventAddress]),
    UserActivityModule,
  ],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
