import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant, participationType } from './entities/participant.entity';

@Injectable()
export class ParticipantsService {

    constructor(
        @InjectRepository(Participant)
        private readonly participantRepository: Repository<Participant>,
    ) {}

     
    interested(eventId: string, userId: string, type: participationType){

    }

    going(eventId: string, userId: string, type: participationType){

    }
    
    cancel(eventId: string, userId: string, type: participationType){

    }

}
