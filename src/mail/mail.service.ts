import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly i18n: I18nService,
  ) {}

  async sendUserRegisterConfirmation(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: await this.i18n.translate(
        'emails.REGISTER_CONFIRMATION.SUBJECT',
      ),
      template: './register-confirmation',
      context: {
        token: token,
        email: email,
      },
    });
  }
}
