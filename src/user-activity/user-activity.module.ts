import { Module } from '@nestjs/common';
import { UserActivityService } from './user-activity.service';

@Module({
  providers: [UserActivityService],
})
export class UserActivityModule {}
