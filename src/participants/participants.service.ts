import { Participant } from './entities/participant.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsService } from 'src/events/events.service';
import { ParticipantResponse } from './dto/participant-response.input';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';
import { I18nService } from 'nestjs-i18n';
import ParticipantByDateResponse from './dto/participant-by-date.response';
import dayjs from 'dayjs';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    private readonly eventsService: EventsService,
    private readonly i18n: I18nService,
  ) {}

  async participateInEvent(
    eventId: string,
    user: User,
    type: number,
  ): Promise<ParticipantResponse> {
    const event = await this.eventsService.findOne(eventId);

    if (!event) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.EVENT_NOT_FOUND'),
      );
    }
    if (type == 0) {
      this.removeUserFromEvent(user, event);
    } else {
      this.addUserToEvent(user, event, type);
    }

    const participantResponse: ParticipantResponse = {
      user: user,
      event: event,
      type: type,
    };

    return participantResponse;
  }

  addUserToEvent(user: User, event: any, type: number) {
    let participate = this.find(user, event);
    if (!participate) {
      participate = this.create(user, event, type);
    } else {
      participate = this.update(user, event, type);
    }
  }

  create(user: User, event: any, type: number) {
    const participate = this.participantRepository.save({
      type: type,
      user: user,
      event: event,
    });

    return participate;
  }

  find(user: User, event: any) {
    const participate = this.participantRepository.findOne({
      relations: ['user', 'event'],
      where: { event: event, user: user },
    });
    return participate;
  }

  async update(user: User, event: any, type: number) {
    const participate = await this.find(user, event);
    const update = await this.participantRepository.create({
      type: type,
      user: user,
      event: event,
    });

    const result = await this.participantRepository.save({
      ...participate,
      ...update,
    });

    return result;
  }

  async removeUserFromEvent(user: User, event: Event) {
    const participantRemove = await this.find(user, event);
    const result = await this.participantRepository.remove(participantRemove);

    return result;
  }

  async findAll(
    limit: number,
    offset: number,
    field: string,
    sort: string,
    eventId: string,
    userId: string,
    type: number,
    query: string,
  ) {
    const participants = this.participantRepository
      .createQueryBuilder('participants')
      .innerJoinAndMapOne(
        'participants.user',
        User,
        'users',
        'participants.user = users.id',
      )
      .innerJoinAndMapOne(
        'participants.event',
        Event,
        'events',
        'participants.event = events.id',
      );
    if (query) {
      participants.andWhere(
        '(events.title like  :title or events.description like :description)',
        { title: `%${query}%`, description: `%${query}%` },
      );
    }

    if (eventId) {
      participants.andWhere('(participants.event = :id)', { id: eventId });
    }

    if (userId) {
      participants.andWhere('(participants.user = :id)', { id: userId });
    }

    if (type == 2 || type == 1) {
      participants.andWhere('(participants.type = :type)', { type: type });
    }

    participants.orderBy(
      `participants.${field}`,
      'ASC' == sort ? 'ASC' : 'DESC',
    );

    const totalRecords = await participants.getMany();
    const participantsMapped = await participants
      .take(limit)
      .skip(offset)
      .getMany();

    return { participants: participantsMapped, totalRecords };
  }

  async findByDate(eventId: string) {
    const participants = await this.participantRepository
      .query(`select  count(user) as count, CAST(updatedAt AS DATE) AS date FROM participants
          where event = "${eventId}"
          group by  CAST(updatedAt AS DATE)
          order by CAST(updatedAt AS DATE) DESC LIMIT 5`);

    const participantByDateResponse = participants.map(
      (participants: ParticipantByDateResponse) => {
        return {
          count: participants.count,
          date: dayjs(participants.date).format('DD/MM/YYYY'),
        };
      },
    );

    return participantByDateResponse;
  }
}
