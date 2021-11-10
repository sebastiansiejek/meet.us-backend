import { Participant } from './entities/participant.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsService } from 'src/events/events.service';
import { ParticipantResponse } from './dto/participant-response.input';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ParticipantsService {
    
    constructor(
        @InjectRepository(Participant)
        private readonly participantRepository: Repository<Participant>,
        private readonly eventsService: EventsService,
    ) {}
 
     
    async participateInEvent(eventId: string, user: User, type: number): Promise<ParticipantResponse>{
        const event  = await this.eventsService.findOne(eventId);

        if(!event) {
            throw new BadRequestException('Event not found');
        }
        let message;
        if(type == 0){
            message = this.removeUserFromEvent(user, event);
        }
        else{
            message = this.addUserToEvent(user, event, type);
        }

        let participantResponse: ParticipantResponse = {
            user: user,
            event: event,
            type: type,
            message: message
        }

        return participantResponse;
    }


    addUserToEvent(user: User, event: any, type: number): String {
        let participate = this.find(user, event);
        if(!participate){
            participate = this.create(user, event, type);
        }
        else{
            participate = this.update(user, event, type);
        }
        
        return 'Dodano użytkownika do wydarzenia';

    }
    removeUserFromEvent(user: User, event: any): String {
        this.remove(user, event);
        return 'Usunięto użtykownika z wydarzenia';

    }

    create(user: User, event: any, type: number){
        const participate =  this.participantRepository.save({
            type: type,
            user: user,
            event: event
        });

        return participate;
    }

    find(user: User, event: any){
        const participate = this.participantRepository.findOne({
            relations: ['user', 'event'],
            where: { event: event, user: user },
          });
        console.log(participate);
        return participate;
    }

    async update(user: User, event: any, type: number){
        const participate = await this.find(user, event);
        const update = await this.participantRepository.create({
            type: type,
            user: user,
            event: event
        });

        const result = await this.participantRepository.save({ ...participate, ...update });

        return result;
    }

    async remove(user: User, event: Event) {
      const participantRemove = await this.find(user, event);
      this.participantRepository.remove(participantRemove);
      return participantRemove;
    }}
