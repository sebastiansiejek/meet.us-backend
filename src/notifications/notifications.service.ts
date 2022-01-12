import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ParticipantsService } from 'src/participants/participants.service';
import { Event } from '../events/entities/event.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { MailService } from 'src/mail/mail.service';
import dayjs from 'dayjs';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    @Inject(forwardRef(() => ParticipantsService))
    private readonly participantService: ParticipantsService,
    private readonly mailService: MailService,
  ) {}

  addNewJob(event: Event) {
    console.log(dayjs(event.startDate).format('DD/MM/YYYY'));
    const sendInterestedUserMail = new CronJob(
      dayjs(event.startDate).subtract(2, 'hours').format('mm HH MM DD *'),
      () => {
        console.log('executing interval job');
        this.sendInterestedUserMail(event);
      },
    );

    const sendTakePartUserMail = new CronJob(
      dayjs(event.startDate).subtract(15, 'minutes').format('mm HH MM DD *'),
      () => {
        console.log('executing interval job');
        this.sendTakePartUserMail(event);
      },
    );
    const sendUserRateEventMail = new CronJob(
      dayjs(event.endDate).add(15, 'minutes').format('mm HH MM DD *'),
      () => {
        console.log('executing interval job');
        this.sendUserRateEventMail(event);
      },
    );
    const deleteAllEventJobs = new CronJob(
      dayjs(event.endDate).add(20, 'minutes').format('mm HH MM DD *'),
      () => {
        console.log('executing interval job');
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
    console.log('sendInterestedUserMail');
  }
  deleteJob(jobName: string) {
    this.schedulerRegistry.deleteCronJob(jobName);
  }

  async sendInterestedUserMail(event: Event) {
    console.log('send mail for interested users');
    console.log('event', event);
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
    console.log('participants', participants);
    console.log('eventOwner', eventOwner);
  }

  async sendTakePartUserMail(event: Event) {
    console.log('send mail for interested users');
    console.log('event', event);
    const eventOwner = event.user.id;
    const participants = await this.participantService.findMany(event, 2);
    for (const participant of participants) {
      if (participant.user.id !== eventOwner) {
        this.mailService.sendTakePartUserMail(participant.user.email, event.id);
      }
    }

    console.log('participants', participants);

    console.log('eventOwner', eventOwner);
  }

  async sendUserRateEventMail(event: Event) {
    console.log('send mail for interested users');
    console.log('event', event);
    const eventOwner = event.user.id;
    const participants = await this.participantService.findMany(event, 2);

    for (const participant of participants) {
      if (participant.user.id !== eventOwner) {
        this.mailService.sendRateUserMail(participant.user.email, event.id);
      }
    }

    console.log('participants', participants);

    console.log('eventOwner', eventOwner);
  }

  deleteAllEventJobs(event) {
    this.schedulerRegistry.deleteCronJob(`${event.id}-sendInterestedUserMail`);
    this.schedulerRegistry.deleteCronJob(`${event.id}-sendTakePartUserMail`);
    this.schedulerRegistry.deleteCronJob(`${event.id}-sendUserRateEventMail`);
    this.schedulerRegistry.deleteCronJob(`${event.id}-deleteAllEventJobs`);
  }
}
