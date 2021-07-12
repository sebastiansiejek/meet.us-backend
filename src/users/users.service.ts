import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token/token.service';
import { MailService } from 'src/mail/mail.service';
import { ActivateUserInput } from './dto/activate-user.input';
import { I18nService } from 'nestjs-i18n';
import { ResetPasswordTokenInput } from './dto/reset-password-token.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly i18n: I18nService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const salt = await bcrypt.genSalt(10);
    createUserInput.password = await bcrypt.hash(
      createUserInput.password,
      salt,
    );

    const user = await this.usersRepository.save(createUserInput);
    const token = this.tokenService.encrypt(user.id);

    this.mailService.sendUserRegisterConfirmation(user.email, token);

    return user;
  }
  findAll(
    limit: number,
    offset: number,
    field: string,
    sort: string,
  ): Promise<[User[], number]> {
    return this.usersRepository.findAndCount({
      take: limit,
      skip: offset,
      order: {
        [field]: sort,
      },
    });
  }

  findOne(id: string) {
    return this.usersRepository.findOneOrFail(id);
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

  async resetPassword(email: string): Promise<{ message: string }> {
    const user = await this.findByMail(email);
    if (!user) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.INVALID_EMAIL'),
      );
    }
    const token = this.tokenService.createToken(user);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(new Date().getTime() + 20 * 60 * 1000);
    this.usersRepository.save(user);

    this.mailService.sendUserResetPassword(user.email, user.resetPasswordToken);

    return {
      message: await this.i18n.translate(
        'emails.RESET_PASSWORD.RESET_PASSWORD_MAIL',
      ),
    };
  }

  async resetPasswordToken(
    resetPasswordToken: ResetPasswordTokenInput,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { token: resetPasswordToken.token },
    });

    if (!user) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.TOKEN_NOT_FOUND'),
      );
    }
    const salt = await bcrypt.genSalt(10);

    const newPassword = await bcrypt.hash(resetPasswordToken.newPassword, salt);

    const confirmPassword = await bcrypt.hash(
      resetPasswordToken.confirmPassword,
      salt,
    );

    if (!(await bcrypt.compare(newPassword, confirmPassword))) {
      throw new BadRequestException(
        await this.i18n.translate('errors.ERROR.PASSWORDS_NOT_MATCH'),
      );
    }

    user.password = newPassword;
    this.usersRepository.save(user);

    //TODO validate password innput

    return {
      message: await this.i18n.translate(
        'emails.RESET_PASSWORD.RESET_PASSWORD_MAIL',
      ),
    };
  }
}
