import { UsersService } from 'src/users/users.service';
import { EventsService } from 'src/events/events.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant, participationType } from './entities/participant.entity';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';
import { ParticipantUpdate } from './dto/participant-update.input';
import { ParticipantResponse } from './dto/participant-response.input';
@Injectable()
export class ParticipantsService {

    constructor(
        @InjectRepository(Participant)
        private readonly participantRepository: Repository<Participant>,
        private readonly eventsService: EventsService,
        private readonly userService: UsersService,
    ) {}
 
     
    async participateInEvent(eventId: string, user: User, type: number): Promise<ParticipantResponse>{
        const event: Event = await this.eventsService.findOne(eventId);
        if(!event) {
            throw new BadRequestException('Event not found');
        }
        let message;
        if(type == 2){
            message = this.removeUserFromEvent(user, event, type);
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
        console.log(participantResponse);

        return participantResponse;
    }


    addUserToEvent(user: User, event: Event, type: number): String {
        let participate = this.find(user, event);
        if(!participate){
            participate = this.create(user, event, type);
        }
        else{
            participate = this.update(user, event, type);
        }

        console.log(participate);
        
        return 'test addUserToEvent';

    }
    removeUserFromEvent(user: User, event: Event, type: number): String {
        this.remove(user, event);
        return 'test removeUserFromEvent';

    }

    create(user: User, event: Event, type: number){
        const participate =  this.participantRepository.save({
            type: type,
            user: user,
            event: event
        });

        return participate;
    }

    find(user: User, event: Event){
        const participate = this.participantRepository.findOne({
            relations: ['user', 'event'],
            where: { event: event, user: user },
          });
        console.log(participate);
        return participate;
    }

    async update(user: User, event: Event, type: number){
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
    }
    
}
