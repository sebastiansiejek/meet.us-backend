import { EventsModule } from '../events/events.module';
import { ParticipantsModule } from '../participants/participants.module';
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [ParticipantsModule, MailModule, EventsModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
