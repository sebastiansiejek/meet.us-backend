import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { actionType, UserActivity } from './entities/userActivity.entity';
import UserActivitySave from './dto/user-activity-save.input';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';
import { getManager, Repository } from 'typeorm';
import UserActivityTagSave from './dto/user-activity-tag-save.input';
@Injectable()
export class UserActivityService {
  entityManager: any = getManager();

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

    this.saveTagsActivity(user, actionType.Tag, event.tags, score, weight);

    this.createOrUpdate(user, actionType.Category, event.type, 1, 0.03);

    this.createOrUpdate(
      user,
      actionType.Duration,
      event.type,
      this.checkDateScore(event),
      0.02,
    );
  }

  async saveTagsActivity(
    user: any,
    action: actionType,
    tags: any,
    score: number,
    weight: number,
  ) {
    if (tags != null) {
      if (tags.length > 0) {
        for (const tag of tags) {
          await this.createOrUpdateTag(user, action, tag.id, score, weight);
        }
      }
    }
  }
  async createOrUpdateTag(
    user: any,
    action: actionType,
    id: any,
    score: number,
    weight: number,
  ) {
    const activity: UserActivityTagSave = {
      user: user,
      actionType: action,
      tag: id,
      score: score,
      weight: weight,
      count: 1,
    };

    const userActivity = await this.userActivityRepository
      .createQueryBuilder('user_activity')
      .where(`user_activity.user = "${user.id}"`)
      .andWhere(`user_activity.actionType = ${action}`)
      .andWhere(`user_activity.tag = "${id}"`)
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
          ` user = "${user.id}"  AND actionType = ${userActivity.actionType} AND tag = "${userActivity.tag}" AND score = ${userActivity.score} AND weight = ${userActivity.weight}`,
        )
        .execute();
    }
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
    this.saveTagsActivity(user, actionType.Rate, event.tags, rate, 0.02);
  }

  saveEventView(user: User, event: Event) {
    this.createOrUpdate(user, actionType.Visit, event.type, 1, 0.01);
    this.saveTagsActivity(user, actionType.Visit, event.tags, 1, 0.01);
  }

  async generateQuery(user: User, distanceQuery: string, field: string) {
    const activities = await this.userActivityRepository
      .createQueryBuilder('user_activity')
      .where(`user_activity.user = "${user.id}"`)
      .getMany();

    const lastElement = activities[activities.length - 1];
    let categoryMaxCount = 0;
    let durationMaxCount = 0;
    let takePartMaxCount = 0;
    let interestedMaxCount = 0;
    let distanceMaxCount = 0;
    let rateMaxCount = 0;
    let visitMaxCount = 0;
    for (const activity of activities) {
      if (activity.actionType === actionType.Category) {
        if (categoryMaxCount < activity.count)
          categoryMaxCount = activity.count;
      }
      if (activity.actionType === actionType.Duration) {
        if (durationMaxCount < activity.count)
          durationMaxCount = activity.count;
      }
      if (activity.actionType === actionType.TakePart) {
        if (takePartMaxCount < activity.count)
          takePartMaxCount = activity.count;
      }
      if (activity.actionType === actionType.Interested) {
        if (interestedMaxCount < activity.count)
          interestedMaxCount = activity.count;
      }
      if (activity.actionType === actionType.Distance) {
        if (distanceMaxCount < activity.count)
          distanceMaxCount = activity.count;
      }
      if (activity.actionType === actionType.Rate) {
        if (rateMaxCount < activity.count) rateMaxCount = activity.count;
      }
      if (activity.actionType === actionType.Visit) {
        if (visitMaxCount < activity.count) visitMaxCount = activity.count;
      }
    }

    let query = '(';
    for (const activity of activities) {
      if (activity.actionType === actionType.Category) {
        query += ` IF(events.type = ${activity.eventType}, ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
        if (categoryMaxCount > 0) {
          query += `+ IF(events.type = ${activity.eventType}, IF(${categoryMaxCount}/${activity.count} = 1, 10, IF(${categoryMaxCount}/${activity.count} >= 0.5, 7, IF(${categoryMaxCount}/${activity.count} < 0.5, 5, 0))), 0)`;
        }
      }
      if (activity.actionType === actionType.Duration) {
        query += ` IF( time_to_sec(timediff(endDate , startDate )) / 3600 < 3, ${activity.count} * ${activity.score} * ${activity.weight} , IF(time_to_sec(timediff(endDate , startDate )) / 3600 > 7, ${activity.count} * ${activity.score} * ${activity.weight}, ${activity.count} * ${activity.score} * ${activity.weight}))`;
      }
      if (activity.actionType === actionType.TakePart) {
        query += ` IF(events.type = ${activity.eventType}, ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
        if (takePartMaxCount > 0) {
          query += `+ IF(events.type = ${activity.eventType}, IF(${takePartMaxCount}/${activity.count} = 1, 15, IF(${takePartMaxCount}/${activity.count} >= 0.5, 12, IF(${takePartMaxCount}/${activity.count} < 0.5, 7, 0))), 0)`;
        }
      }
      if (activity.actionType === actionType.Interested) {
        query += ` IF(events.type = ${activity.eventType}, ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
        if (interestedMaxCount > 0) {
          query += `+ IF(events.type = ${activity.eventType}, IF(${interestedMaxCount}/${activity.count} = 1, 10, IF(${interestedMaxCount}/${activity.count} >= 0.5, 7, IF(${interestedMaxCount}/${activity.count} < 0.5, 5, 0))), 0)`;
        }
      }
      if (activity.actionType === actionType.Distance) {
        query += `IF( ${distanceQuery} > 0, (IF(${distanceQuery} < 30, ${activity.count} * ${activity.score} * ${activity.weight}, IF( ${distanceQuery} > 30 AND ${distanceQuery} < 70, ${activity.count} * ${activity.score} * ${activity.weight}, IF( ${distanceQuery} > 70, ${activity.count} * ${activity.score} * ${activity.weight}, 0)))), 0)`;
      }
      if (activity.actionType === actionType.Rate) {
        query += ` IF(events.type = ${activity.eventType}, ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
        if (rateMaxCount > 0) {
          query += `+ IF(events.type = ${activity.eventType}, IF(${rateMaxCount}/${activity.count} = 1, 10, IF(${rateMaxCount}/${activity.count} >= 0.5, 7, IF(${rateMaxCount}/${activity.count} < 0.5, 5, 0))), 0)`;
        }
      }
      if (activity.actionType === actionType.Visit) {
        query += ` IF(events.type = ${activity.eventType}, ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
        if (visitMaxCount > 0) {
          query += `+ IF(events.type = ${activity.eventType}, IF(${visitMaxCount}/${activity.count} = 1, 7, IF(${visitMaxCount}/${activity.count} >= 0.5, 5, IF(${visitMaxCount}/${activity.count} < 0.5, 3, 0))), 0)`;
        }
      }
      if (activity.actionType === actionType.Tag) {
        query += ` IF(events.tags like "${activity.eventType}", ${activity.count} * ${activity.score} * ${activity.weight}, 0) `;
      }
      if (lastElement != activity) {
        query += ' + ';
      }
    }

    if (field == 'popular') {
      const maxVisitCount = await this.getMaxVisitCount();

      if (maxVisitCount > 0) {
        query += `+ if(events.visitCount/${maxVisitCount} >= 1, 20, 
                    if(events.visitCount/${maxVisitCount} >= 0.7, 15, 	
                        if (events.visitCount/${maxVisitCount} >= 0.4, 10, 
                            if (events.visitCount/${maxVisitCount} < 0.4 and events.visitCount/${maxVisitCount} > 0.1, 5, 0)
                        ) 
                    )
                )`;
      }
    }
    query += `)`;
    return query;
  }
  async getMaxVisitCount() {
    const events = await this.entityManager.query(
      `select visitCount FROM events order by visitCount DESC  LIMIT 1`,
    );
    for (const event of events) {
      return event.visitCount;
    }
    return 0;
  }
}
