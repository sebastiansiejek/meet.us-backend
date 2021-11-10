import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsResolver } from './participants.resolver';
import { Participant } from './entities/participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/events/events.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Participant]), EventsModule, UsersModule ],
  providers: [ParticipantsService, ParticipantsResolver]
})
export class ParticipantsModule {}
