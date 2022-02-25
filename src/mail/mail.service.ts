import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { I18nLang, I18nService } from 'nestjs-i18n';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly i18n: I18nService,
  ) {}

  async sendUserRegisterConfirmation(
    email: string,
    token: string,
    @I18nLang() lang: string,
  ) {
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
        title: await this.i18n.translate('emails.BODY.EMAIL_VERIFY_TITLE', {
          lang,
        }),
        emailVerify: await this.i18n.translate('emails.BODY.EMAIL_VERIFY', {
          lang,
        }),
      },
    });
  }
  async sendUserResetPassword(
    email: string,
    token: string,
    @I18nLang() lang: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: await this.i18n.translate('emails.RESET_PASSWORD.SUBJECT', {
        lang,
      }),
      template: './reset-password',
      context: {
        token: token,
        email: email,
        hostDomain: process.env.HOST_DOMAIN,
        title: await this.i18n.translate('emails.BODY.PASSWORD_RESET', {
          lang,
        }),
      },
    });
  }
  async sendInterestedUserMail(email: string, eventId: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: await this.i18n.translate('emails.INTERESTED.SUBJECT'),
      template: './notification-interested',
      context: {
        eventId: eventId,
        email: email,
        hostDomain: process.env.HOST_DOMAIN,
        body: await this.i18n.translate('emails.INTERESTED.BODY'),
      },
    });
  }
  async sendTakePartUserMail(email: string, eventId: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: await this.i18n.translate('emails.TAKE_PART.SUBJECT'),
      template: './notification-takepart',
      context: {
        eventId: eventId,
        email: email,
        hostDomain: process.env.HOST_DOMAIN,
        body: await this.i18n.translate('emails.TAKE_PART.BODY'),
      },
    });
  }
  async sendRateUserMail(email: string, eventId: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: await this.i18n.translate('emails.RATE.SUBJECT'),
      template: './notification-rate',
      context: {
        eventId: eventId,
        email: email,
        hostDomain: process.env.HOST_DOMAIN,
        body: await this.i18n.translate('emails.RATE.BODY'),
      },
    });
  }
}
