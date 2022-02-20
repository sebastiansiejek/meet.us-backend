import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailModule } from '../mail/mail.module';
import { TokenService } from './token/token.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  providers: [UsersResolver, UsersService, TokenService],
  exports: [UsersService],
})
export class UsersModule {}
