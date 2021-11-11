import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { connectionFromArraySlice } from 'graphql-relay';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import ConnectionArgs from 'src/pagination/types/connection.args';
import { User } from 'src/users/entities/user.entity';
import ParticipantListResponse from './dto/participant-list.response';
import { ParticipantResponse } from './dto/participant-response.input';
import { ParticipantUpdate } from './dto/participant-update.input';
import { Participant } from './entities/participant.entity';
import { ParticipantsService } from './participants.service';

@Resolver()
export class ParticipantsResolver {
    constructor(private readonly participantService: ParticipantsService){}

    @Mutation(() => Participant)
    @UseGuards(GqlAuthGuard)
    participateInEvent(@CurrentUser() user: User, @Args('participateInEvent') participantUpdate: ParticipantUpdate): Promise<ParticipantResponse> {
        return this.participantService.participateInEvent(participantUpdate.eventId, user, participantUpdate.type);
    }

    
    @Query(() => ParticipantListResponse, { name: 'participantsEvents' })
    async participantsEvents(@Args() args: ConnectionArgs, @Args('eventId', { nullable: true }) eventId: string, @Args('userId', { nullable: true }) userId: string, @Args('type', { nullable: true }) type: number, @Args('query', {nullable: true}) query: string): Promise<ParticipantListResponse> {
        
        const { limit, offset } = args.pagingParams();
        const { field, sort } = args.orderParams();
        const records = await this.participantService.findAll(
            limit,
            offset,
            field,
            sort,
            eventId,
            userId,
            type,
            query
        );
        const participants = records.participants;
        const count = records.totalRecords.length;
          
        const page = connectionFromArraySlice(participants, args, {
            arrayLength: count,
            sliceStart: offset || 0,
        });
          
        return { page, pageData: { count, limit, offset } };
    }
    
    @Query(() => ParticipantListResponse, { name: 'userParticipation' })
    @UseGuards(GqlAuthGuard)
    async userParticipation(@CurrentUser() user: User, @Args() args: ConnectionArgs, @Args('type', { nullable: true }) type: number, @Args('query', {nullable: true}) query: string): Promise<ParticipantListResponse> {
        const { limit, offset } = args.pagingParams();
        const { field, sort } = args.orderParams();
        const records = await this.participantService.findAll(
            limit,
            offset,
            field,
            sort,
            null,
            user.id,
            type,
            query
        );
        const participants = records.participants;
        const count = records.totalRecords.length;
          
        const page = connectionFromArraySlice(participants, args, {
            arrayLength: count,
            sliceStart: offset || 0,
        });
          
        return { page, pageData: { count, limit, offset } };
    }
}
