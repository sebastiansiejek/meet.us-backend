import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { ParticipantResponse } from './dto/participant-response.input';
import { ParticipantUpdate } from './dto/participant-update.input';
import { Participant } from './entities/participant.entity';
import { ParticipantsService } from './participants.service';

@Resolver(() => Participant)
export class ParticipantsResolver {
    constructor(private readonly participantService: ParticipantsService){}

    @Mutation(() => Participant)
    @UseGuards(GqlAuthGuard)
    participateInEvent(@CurrentUser() user: User, @Args('participateInEvent') participantUpdate: ParticipantUpdate): Promise<ParticipantResponse> {
        return this.participantService.participateInEvent(participantUpdate.eventId, user, participantUpdate.type);
    }
  

}
