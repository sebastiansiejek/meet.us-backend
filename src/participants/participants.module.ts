import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsResolver } from './participants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Participant]), EventsModule, UsersModule ],
  providers: [ParticipantsService, ParticipantsResolver]
})
export class ParticipantsModule {}
