import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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

  async login(
    usersRepository: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const token = this.jwtService.sign({
      email: usersRepository.email,
      id: usersRepository.id,
    });
    const decoded = await this.verify(token);
    return {
      accessToken: token,
      refreshToken: await this.createRefreshToken(decoded.id),
    };
  }

  async refreshLoginToken(user: User, token: string) {
    const searchedUser = await this.userService.findOne(user.id);

    if (searchedUser === undefined) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.USER_NOT_FOUND'),
      );
    }

    if (searchedUser.refreshTokenExpires < new Date()) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.EXPIRED_TOKEN'),
      );
    }
    if (await bcrypt.compare(token, searchedUser.refreshToken)) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.TOKEN_NOT_FOUND'),
      );
    }

    return {
      accessToken: this.jwtService.sign({
        email: searchedUser.email,
        id: searchedUser.id,
      }),
      refreshToken: await this.createRefreshToken(searchedUser.id),
    };
  }

  async createRefreshToken(userId: string): Promise<string> {
    return await this.userService.saveRefreshToken(
      userId,
      await this.randomTokenString(),
      new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
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
    const randomString = crypto.randomBytes(100).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const token = await bcrypt.hash(randomString, salt);
    return { raw: randomString, encryptedToken: token };
  }
}
