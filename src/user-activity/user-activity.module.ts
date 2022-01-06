import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivity } from './entities/userActivity.entity';
import { UserActivityService } from './user-activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserActivity])],
  providers: [UserActivityService],
  exports: [UserActivityService],
})
export class UserActivityModule {}
