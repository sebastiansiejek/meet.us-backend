import { ObjectType, Field } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { Event } from '../../events/entities/event.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({
  name: 'ratings',
})
export class Rating {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  user: User;

  @Field(() => Event)
  @ManyToOne(() => Event, { nullable: false })
  @JoinColumn({ name: 'event', referencedColumnName: 'id' })
  event: Event;

  @Field()
  @Column({ nullable: false })
  @Min(1)
  @Max(5)
  rate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
