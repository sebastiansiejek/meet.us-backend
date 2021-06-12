import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.findByMail(email);

    if (user === undefined) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.INVALID_EMAIL'),
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.INVALID_PASSWORD'),
      );
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
  }

  login(usersRepository: User): { accessToken: string } {
    return {
      accessToken: this.jwtService.sign({
        email: usersRepository.email,
        id: usersRepository.id,
      }),
    };
  }

  async verify(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    const user = this.userService.findByMail(decoded.email);

    return user;
  }
}
