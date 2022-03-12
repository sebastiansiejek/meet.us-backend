import { UsersModule } from '../users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivity } from './entities/userActivity.entity';
import { UserActivityService } from './user-activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserActivity]), UsersModule],
  providers: [UserActivityService],
  exports: [UserActivityService],
})
export class UserActivityModule {}
