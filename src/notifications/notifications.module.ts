import { ParticipantsModule } from 'src/participants/participants.module';
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [ParticipantsModule, MailModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
