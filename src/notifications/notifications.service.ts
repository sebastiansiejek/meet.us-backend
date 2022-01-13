import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ParticipantsService } from 'src/participants/participants.service';
import { Event } from '../events/entities/event.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';
import dayjs from 'dayjs';
import { CronJob } from 'cron';

@Injectable()
export class NotificationsService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => ParticipantsService))
    private readonly participantService: ParticipantsService,
    private readonly mailService: MailService,
  ) {}

  async addNewJob(event: Event) {
    const sendInterestedUserMail = new CronJob(
      dayjs(event.startDate).subtract(50, 'minutes').format('mm HH DD MM *'),
      () => {
        this.sendInterestedUserMail(event);
      },
    );

    const sendTakePartUserMail = new CronJob(
      dayjs(event.startDate).subtract(15, 'minutes').format('mm HH DD MM *'),
      () => {
        this.sendTakePartUserMail(event);
      },
    );

    const sendUserRateEventMail = new CronJob(
      dayjs(event.endDate).add(10, 'minutes').format('mm HH DD MM *'),
      () => {
        this.sendUserRateEventMail(event);
      },
    );

    const deleteAllEventJobs = new CronJob(
      dayjs(event.endDate).add(15, 'minutes').format('mm HH DD MM *'),
      () => {
        this.deleteAllEventJobs(event);
      },
    );

    this.schedulerRegistry.addCronJob(
      `${event.id}-sendInterestedUserMail`,
      sendInterestedUserMail,
    );
    this.schedulerRegistry.addCronJob(
      `${event.id}-sendTakePartUserMail`,
      sendTakePartUserMail,
    );
    this.schedulerRegistry.addCronJob(
      `${event.id}-sendUserRateEventMail`,
      sendUserRateEventMail,
    );
    this.schedulerRegistry.addCronJob(
      `${event.id}-deleteAllEventJobs`,
      deleteAllEventJobs,
    );

    sendInterestedUserMail.start();
    sendTakePartUserMail.start();
    sendUserRateEventMail.start();
    deleteAllEventJobs.start();
  }
  deleteJob(jobName: string) {
    this.schedulerRegistry.deleteCronJob(jobName);
  }

  async sendInterestedUserMail(event: Event) {
    const eventOwner = event.user.id;
    const participants = await this.participantService.findMany(event, 1);
    for (const participant of participants) {
      if (participant.user.id !== eventOwner) {
        this.mailService.sendInterestedUserMail(
          participant.user.email,
          event.id,
        );
      }
    }
  }

  async sendTakePartUserMail(event: Event) {
    const eventOwner = event.user.id;
    const participants = await this.participantService.findMany(event, 2);
    for (const participant of participants) {
      if (participant.user.id !== eventOwner) {
        this.mailService.sendTakePartUserMail(participant.user.email, event.id);
      }
    }
  }

  async sendUserRateEventMail(event: Event) {
    const eventOwner = event.user.id;
    const participants = await this.participantService.findMany(event, 2);

    for (const participant of participants) {
      if (participant.user.id !== eventOwner) {
        this.mailService.sendRateUserMail(participant.user.email, event.id);
      }
    }
  }

  deleteAllEventJobs(event) {
    this.schedulerRegistry.deleteCronJob(`${event.id}-sendInterestedUserMail`);
    this.schedulerRegistry.deleteCronJob(`${event.id}-sendTakePartUserMail`);
    this.schedulerRegistry.deleteCronJob(`${event.id}-sendUserRateEventMail`);
    this.schedulerRegistry.deleteCronJob(`${event.id}-deleteAllEventJobs`);
  }
}
