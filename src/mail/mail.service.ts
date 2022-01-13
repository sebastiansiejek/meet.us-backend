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
        hostDomain: process.env.HOST_DOMAIN,
        title: await this.i18n.translate('emails.BODY.EMAIL_VERIFY_TITLE'),
        emailVerify: await this.i18n.translate('emails.BODY.EMAIL_VERIFY'),
      },
    });
  }
  async sendUserResetPassword(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: await this.i18n.translate('emails.RESET_PASSWORD.SUBJECT'),
      template: './reset-password',
      context: {
        token: token,
        email: email,
        hostDomain: process.env.HOST_DOMAIN,
        title: await this.i18n.translate('emails.BODY.PASSWORD_RESET'),
      },
    });
  }
}
