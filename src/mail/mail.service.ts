import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  async sendUserRegisterConfirmation() {
    await this.mailerService.sendMail({
      to: '',
      subject: await this.i18n.translate(
        'emails.REGISTER_CONFIRMATION.SUBJECT',
      ),
      template: './register-confirmation',
      context: {
        name: '',
      },
    });
  }
}
