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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
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
}
