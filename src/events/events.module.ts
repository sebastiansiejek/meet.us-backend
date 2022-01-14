import { UsersModule } from 'src/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventAddress } from './entities/event-address.entity';
import { UserActivityModule } from 'src/user-activity/user-activity.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventAddress]),
    UserActivityModule,
    UsersModule,
    forwardRef(() => NotificationsModule),
  ],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
