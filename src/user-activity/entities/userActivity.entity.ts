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

export enum eventType {
  Sport,
  Party,
  Social,
}

export enum actionType {
  Category,
  Duration,
  TakePart,
  Interested,
  Distance,
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
  @Column({ nullable: false })
  actionType: actionType;

  @Field()
  @Column({ nullable: false })
  eventType: eventType;

  @Field()
  @Column({ nullable: false })
  count: number;

  @Field()
  @Column({ nullable: false })
  score: number;

  @Field()
  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  weight: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
