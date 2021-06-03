import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Image } from '../images/entities/image.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const salt = await bcrypt.genSalt(10);
    createUserInput.password = await bcrypt.hash(
      createUserInput.password,
      salt,
    );
    return await this.usersRepository.save(createUserInput);
  }
  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOneOrFail(id);
  }

  async findByMail(mail: string) {
    return this.usersRepository.findOne({ where: { email: mail } });
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const user = await this.usersRepository.findOne(id);
    return this.usersRepository.save({ ...user, ...updateUserInput });
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne(id);
    this.usersRepository.remove(user);
    return user;
  }
  async addImage(id: string, image: Image) {
    const user = await this.usersRepository.findOne(id);
    user.image = image;
    return await this.usersRepository.save(user);
  }
}
