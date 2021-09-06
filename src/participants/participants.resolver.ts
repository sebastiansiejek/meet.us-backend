import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { ParticipantUpdate } from './dto/participant-update.input';
import { Participant } from './entities/participant.entity';
import { ParticipantsService } from './participants.service';

@Resolver(() => Participant)
export class ParticipantsResolver {
    constructor(private readonly participantService: ParticipantsService){}

    @Mutation(() => Participant)
    @UseGuards(GqlAuthGuard)
    interested(@CurrentUser() user: User, @Args('interested') participantUpdate: ParticipantUpdate) {
        return this.participantService.interested(participantUpdate.eventId, user.id, participantUpdate.type);
    }
  
    @Mutation(() => Participant)
    @UseGuards(GqlAuthGuard)
    going(@CurrentUser() user: User, @Args('interested') participantUpdate: ParticipantUpdate) {
        return this.participantService.interested(participantUpdate.eventId, user.id, participantUpdate.type);
    }
  
    @Mutation(() => Participant)
    @UseGuards(GqlAuthGuard)
    canceled(@CurrentUser() user: User, @Args('interested') participantUpdate: ParticipantUpdate) {
        return this.participantService.interested(participantUpdate.eventId, user.id, participantUpdate.type);
    }

}
