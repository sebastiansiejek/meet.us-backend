import { UserActivityModule } from './../user-activity/user-activity.module';
import { forwardRef, Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { Participant } from './entities/participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '../events/events.module';
import { UsersModule } from '../users/users.module';
import { ParticipantsResolver } from './participants.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant]),
    forwardRef(() => EventsModule),
    UsersModule,
    UserActivityModule,
  ],
  providers: [ParticipantsService, ParticipantsResolver],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
