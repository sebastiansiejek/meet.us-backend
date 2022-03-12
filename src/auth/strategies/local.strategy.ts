import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { I18nService } from 'nestjs-i18n';
import { Strategy } from 'passport-local';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, pass: string): Promise<User> {
    const user = await this.authService.validate(email, pass);
    if (!user.isActive) {
      throw new UnauthorizedException(
        await this.i18n.translate('errors.ERROR.USER_NOT_ACTIVE'),
      );
    }
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
