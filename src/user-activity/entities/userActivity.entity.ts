import { eventType } from 'src/events/entities/event.entity';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum actionType {
  Category,
  Duration,
  TakePart,
  Interested,
  Distance,
  Rate,
  Visit,
  Tag,
}

registerEnumType(actionType, {
  name: 'actionType',
});

registerEnumType(eventType, {
  name: 'eventType',
});
@ObjectType()
@Entity({
  name: 'user_activity',
})
export class UserActivity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  user: User;

  @Field()
  @Column({ nullable: true })
  actionType: actionType;

  @Field()
  @Column({ nullable: true })
  eventType: eventType;

  @Field()
  @Column('mediumtext', { nullable: true })
  tag: string;

  @Field()
  @Column({ nullable: true })
  count: number;

  @Field()
  @Column({ nullable: true })
  score: number;

  @Field()
  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  weight: number;

  @Field()
  @Column({ nullable: true })
  identifier: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
