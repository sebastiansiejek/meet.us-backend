import { UsersModule } from 'src/users/users.module';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventAddress } from './entities/event-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventAddress]), UsersModule],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
