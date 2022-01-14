import { UserActivityModule } from './../user-activity/user-activity.module';
import { forwardRef, Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { Participant } from './entities/participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant]),
    forwardRef(() => EventsModule),
    UsersModule,
    UserActivityModule,
  ],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
