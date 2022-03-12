import { EventsService } from '../events/events.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ParticipantsService } from '../participants/participants.service';
import { Event } from '../events/entities/event.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from '../mail/mail.service';
import dayjs from 'dayjs';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(forwardRef(() => ParticipantsService))
    private readonly participantService: ParticipantsService,
    private readonly mailService: MailService,
    private readonly eventService: EventsService,
  ) {}

  async sendInterestedUserMail(event: Event) {
    const eventOwner = event.user.id;
    const participants = await this.participantService.findMany(event, 1);
    for (const participant of participants) {
      if (participant.user.id !== eventOwner) {
        try {
          this.mailService.sendInterestedUserMail(
            participant.user.email,
            event.id,
          );
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  async sendTakePartUserMail(event: Event) {
    const eventOwner = event.user.id;
    const participants = await this.participantService.findMany(event, 2);
    for (const participant of participants) {
      if (participant.user.id !== eventOwner) {
        try {
          this.mailService.sendTakePartUserMail(
            participant.user.email,
            event.id,
          );
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  async sendUserRateEventMail(event: Event) {
    const eventOwner = event.user.id;
    const participants = await this.participantService.findMany(event, 2);

    for (const participant of participants) {
      if (participant.user.id !== eventOwner) {
        try {
          this.mailService.sendRateUserMail(participant.user.email, event.id);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async interested() {
    const start = dayjs().add(120, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs().add(121, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    const events = await this.eventService.searchStartDate(start, end);

    for (const event of events) {
      this.sendInterestedUserMail(event);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async takePart() {
    const start = dayjs().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs().add(31, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    const events = await this.eventService.searchStartDate(start, end);

    for (const event of events) {
      this.sendTakePartUserMail(event);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async userRate() {
    const start = dayjs().subtract(16, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs().subtract(15, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    const events = await this.eventService.searchEndDate(start, end);

    for (const event of events) {
      this.sendUserRateEventMail(event);
    }
  }
}
