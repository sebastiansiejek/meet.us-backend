import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { actionType, UserActivity } from './entities/userActivity.entity';
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
    let action = actionType.Interested;
    let score = 2;
    let weight = 0.03;
    if (type === 2) {
      //Take part
      action = actionType.TakePart;
      score = 3;
      weight = 0.05;
    }
    this.createOrUpdate(user, action, event.type, score, weight);

    this.createOrUpdate(user, actionType.Category, event.type, 1, 0.03);

    this.createOrUpdate(
      user,
      actionType.Duration,
      event.type,
      this.checkDateScore(event),
      0.02,
    );
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
          ` user = "${user.id}"  AND actionType = ${userActivity.actionType} AND eventType = ${userActivity.eventType} AND score = ${userActivity.score} AND weight = ${userActivity.weight}`,
        )
        .execute();
    }
  }
  async getUserActivity(user: User) {
    return this.userActivityRepository
      .createQueryBuilder('user_activity')
      .where(`user_activity.user = "${user.id}"`)
      .getMany();
  }
  async saveDistanceSerchedQuery(userId: string, distance: number) {
    const user = await this.usersService.findOne(userId);
    let score = 1;
    if (distance > 30 && distance < 70) score = 2;
    if (distance <= 70) score = 3;

    this.createOrUpdate(user, actionType.Distance, null, score, 0.03);
  }

  async saveRateActivity(rate: number, user: User, event: any) {
    if (rate === 3) rate *= -1;
    if (rate === 2) rate *= -2;
    if (rate === 1) rate *= -3;

    this.createOrUpdate(user, actionType.Rate, event.type, rate, 0.04);
  }

  saveEventView(user: User, event: Event) {
    this.createOrUpdate(user, actionType.Visit, event.type, 1, 0.01);
  }

  async generateQuery(user: User, distanceQuery: string) {
    const activities = await this.userActivityRepository
      .createQueryBuilder('user_activity')
      .where(`user_activity.user = "${user.id}"`)
      .getMany();

    const lastElement = activities[activities.length - 1];

    let query = '(';
    for (const activity of activities) {
      if (activity.actionType === actionType.Category) {
        query += ` IF(events.type = ${activity.eventType}, ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
      }
      if (activity.actionType === actionType.Duration) {
        query += ` IF( time_to_sec(timediff(endDate , startDate )) / 3600 < 3, ${activity.count} * ${activity.score} * ${activity.weight} , IF(time_to_sec(timediff(endDate , startDate )) / 3600 > 7, ${activity.count} * ${activity.score} * ${activity.weight}, ${activity.count} * ${activity.score} * ${activity.weight}))`;
      }
      if (activity.actionType === actionType.TakePart) {
        query += ` IF(events.type = ${activity.eventType}, ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
      }
      if (activity.actionType === actionType.Interested) {
        query += ` IF(events.type = ${activity.eventType}, ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
      }
      if (activity.actionType === actionType.Distance) {
        query += `IF( ${distanceQuery} > 0, (IF(${distanceQuery} < 30, ${activity.count} * ${activity.score} * ${activity.weight}, IF( ${distanceQuery} > 30 AND ${distanceQuery} < 70, ${activity.count} * ${activity.score} * ${activity.weight}, IF( ${distanceQuery} > 70, ${activity.count} * ${activity.score} * ${activity.weight}, 0)))), 0)`;
      }
      if (activity.actionType === actionType.Rate) {
        query += ` IF(events.type = ${activity.eventType}, ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
      }
      if (activity.actionType === actionType.Visit) {
        query += ` IF(events.type = ${activity.eventType}, ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
      }
      if (lastElement != activity) {
        query += ' + ';
      }
    }
    query += `)`;

    return query;
  }
}
