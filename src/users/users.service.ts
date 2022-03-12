import { ActivateUserInput } from './dto/activate-user.input';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';
import { ResetPasswordTokenInput } from './dto/reset-password-token.input';
import { TokenService } from './token/token.service';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { genSalt, hash, compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly i18n: I18nService,
  ) {}

  async create(createUserInput: CreateUserInput, @I18nLang() lang: string) {
    const salt = await genSalt(10);
    createUserInput.password = await hash(createUserInput.password, salt);

    const user = await this.usersRepository.save(createUserInput);
    const token = this.tokenService.encrypt(user.id);

    this.mailService.sendUserRegisterConfirmation(user.email, token, lang);

    return user;
  }
  findAll(
    limit: number,
    offset: number,
    field: string,
    sort: string,
  ): Promise<[User[], number]> {
    return this.usersRepository.findAndCount({
      relations: ['company'],
      take: limit,
      skip: offset,
      order: {
        [field]: sort,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneOrFail({
      where: { id: id },
      relations: ['company'],
    });

    return user;
  }

  async findByMail(mail: string) {
    return this.usersRepository.findOne({ where: { email: mail } });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const user = await this.findOne(id);
    return this.usersRepository.save({ ...user, ...updateUserInput });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    this.usersRepository.remove(user);
    return user;
  }

  async activateUser(activateUserInput: ActivateUserInput) {
    const decrypted = await this.tokenService.decrypt(activateUserInput.token);
    const dateIsValid = this.tokenService.validateDate(decrypted.validityDate);

    const user = await this.usersRepository.findOne(decrypted.userId);

    if (user.isActive) {
      throw new BadRequestException('User has been activated already');
    }

    if (!user.isActive) {
      if (dateIsValid) {
        user.isActive = true;
      }

      if (!dateIsValid) {
        throw new BadRequestException('Invalid token date');
      }
    }

    return await this.usersRepository.save(user);
  }

  async resetPassword(
    email: string,
    @I18nLang() lang: string,
  ): Promise<{ message: string }> {
    const user = await this.findByMail(email);
    if (!user) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.INVALID_EMAIL', { lang }),
      );
    }
    const token = this.tokenService.createToken(user);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(new Date().getTime() + 20 * 60 * 1000);
    this.usersRepository.save(user);

    this.mailService.sendUserResetPassword(
      user.email,
      user.resetPasswordToken,
      lang,
    );

    return {
      message: await this.i18n.translate(
        'emails.RESET_PASSWORD.RESET_PASSWORD_MAIL',
        { lang },
      ),
    };
  }

  async resetPasswordToken(
    resetPasswordToken: ResetPasswordTokenInput,
    @I18nLang() lang: string,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { resetPasswordToken: resetPasswordToken.token },
    });

    if (!user) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.TOKEN_NOT_FOUND', { lang }),
      );
    }
    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.EXPIRED_TOKEN', { lang }),
      );
    }

    const salt = await genSalt(10);
    const confirmPassword = await hash(
      resetPasswordToken.confirmPassword,
      salt,
    );

    if (!(await compare(resetPasswordToken.newPassword, confirmPassword))) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.PASSWORDS_NOT_MATCH', { lang }),
      );
    }

    user.password = confirmPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    this.usersRepository.save(user);

    return {
      message: await this.i18n.translate(
        'errors.ERROR.PASSWROD_RESET_SUCCESSFULY',
      ),
    };
  }

  async saveRefreshToken(userId: string, token: any, date: Date) {
    const user = await this.findOne(userId);
    user.refreshToken = token.encryptedToken;
    user.refreshTokenExpires = date;
    this.usersRepository.save(user);
    return token.raw;
  }
}
