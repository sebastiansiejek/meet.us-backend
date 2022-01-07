import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActivity } from './entities/userActivity.entity';
import UserActivitySave from './dto/user-activity-save.input';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class UserActivityService {
  constructor(
    @InjectRepository(UserActivity)
    private readonly userActivityRepository: Repository<UserActivity>,
    private readonly usersService: UsersService,
  ) {}

  saveParticipantActivity(type, user, event) {
    //Interested
    let actionType = 3;
    let score = 2;
    let weight = 0.03;
    if (type == 2) {
      //Take part
      actionType = 2;
      score = 3;
      weight = 0.05;
    }
    this.createOrUpdate(user, actionType, event.type, score, weight);

    this.createOrUpdate(user, 0, event.type, score, 0.03);

    this.createOrUpdate(user, 1, event.type, this.checkDateScore(event), 0.02);
  }

  checkDateScore(event: any): number {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    if (hours < 3) return 1;
    if (hours > 7) return 3;

    return 2;
  }

  async createOrUpdate(
    user: any,
    actionType: number,
    type: any,
    score: number,
    weight: number,
  ) {
    const activity: UserActivitySave = {
      user: user,
      actionType: actionType,
      eventType: type,
      score: score,
      weight: weight,
      count: 1,
    };
    const userActivity = await this.userActivityRepository
      .createQueryBuilder('user_activity')
      .where(`user_activity.user = "${user.id}"`)
      .andWhere(`user_activity.actionType = ${actionType}`)
      .andWhere(`user_activity.eventType = ${type}`)
      .andWhere(`user_activity.score = ${score}`)
      .andWhere(`user_activity.weight = ${weight}`)
      .getOne();

    if (!userActivity) {
      this.userActivityRepository.save(activity);
    } else {
      await this.userActivityRepository
        .createQueryBuilder()
        .update(UserActivity)
        .set({
          count: () => 'count + 1',
        })
        .where(
          ' user = :user  AND actionType = :actionType AND eventType = :eventType AND score = :score AND weight = :weight',
          {
            user: user.id,
            actionType: userActivity.actionType,
            type: userActivity.eventType,
            score: userActivity.score,
            weight: userActivity.weight,
          },
        )
        .execute();
    }
  }

  async saveDistanceSerchedQuery(userId: string, distance: number) {
    const user = await this.usersService.findOne(userId);
    let score = 1;
    if (distance > 30 && distance < 70) score = 2;
    if (distance <= 70) score = 3;

    this.createOrUpdate(user, 4, null, score, 0.03);
  }

  async saveRateActivity(rate: number, user: User, event: any) {
    if (rate < 3) rate *= -1;

    this.createOrUpdate(user, 5, event.type, rate, 0.04);
  }

  saveEventView(user: User, event: Event) {
    this.createOrUpdate(user, 6, event.type, 1, 0.01);
  }
}
