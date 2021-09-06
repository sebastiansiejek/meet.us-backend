import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsResolver } from './participants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participant])],
  providers: [ParticipantsService, ParticipantsResolver]
})
export class ParticipantsModule {}
