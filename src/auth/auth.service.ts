import {
  getTokenExpiresTime,
  getRefreshTokenExpiresTime,
} from './../utils/token';
import { BadRequestException, Injectable } from '@nestjs/common';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { compare, genSalt, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import dayjs from 'dayjs';

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

    if (!(await compare(password, user.password))) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.INVALID_PASSWORD'),
      );
    }

    if (user && (await compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
  }

  async login(
    usersRepository: User,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
    accessTokenExpires: number;
  }> {
    const user = await this.userService.findByMail(usersRepository.email);
    const { id, email } = user;
    const expiresIn = getTokenExpiresTime();

    const token = this.jwtService.sign(
      {
        email,
        id,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn,
      },
    );

    const decoded = await this.verify(token);

    return {
      accessToken: token,
      refreshToken: await this.createRefreshToken(decoded.id),
      accessTokenExpires: expiresIn,
      user,
    };
  }

  async refreshLoginToken(user: User, token: string, @I18nLang() lang: string) {
    const searchedUser = await this.userService.findOne(user.id);

    if (searchedUser === undefined) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.USER_NOT_FOUND', { lang }),
      );
    }

    if (searchedUser.refreshTokenExpires < new Date()) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.EXPIRED_TOKEN', { lang }),
      );
    }
    if (await compare(token, searchedUser.refreshToken)) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.TOKEN_NOT_FOUND', { lang }),
      );
    }

    return {
      accessToken: this.jwtService.sign({
        email: searchedUser.email,
        id: searchedUser.id,
      }),
      refreshToken: await this.createRefreshToken(searchedUser.id),
      accessTokenExpires: getTokenExpiresTime(),
    };
  }

  async createRefreshToken(userId: string): Promise<string> {
    return await this.userService.saveRefreshToken(
      userId,
      await this.randomTokenString(),
      dayjs.unix(getRefreshTokenExpiresTime()).toDate(),
    );
  }

  async verify(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const user = this.userService.findByMail(decoded.email);
    return user;
  }

  async randomTokenString(): Promise<{ raw: string; encryptedToken: string }> {
    const randomString = randomBytes(100).toString('hex');
    const salt = await genSalt(10);
    const token = await hash(randomString, salt);
    return { raw: randomString, encryptedToken: token };
  }
}
