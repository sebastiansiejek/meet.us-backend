import { ObjectType, Field, registerEnumType, Int } from '@nestjs/graphql';
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
import { IEventState } from '../IEvents';

export enum eventType {
  Sport,
  Party,
  Social,
}

registerEnumType(eventType, {
  name: 'eventType',
});

@ObjectType()
@Entity({
  name: 'events',
})
export class Event {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @ManyToOne(() => User, { nullable: false, onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  user: User;

  @Field()
  @Column({ nullable: false })
  title: string;

  @Field()
  @Column({ nullable: false })
  description: string;

  @Field()
  @Column({ nullable: false, default: eventType.Party })
  type: eventType;

  @Field({ nullable: true })
  state: IEventState;

  @Field()
  @Column({ nullable: false })
  startDate: Date;

  @Field()
  @Column({ nullable: false })
  endDate: Date;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  maxParticipants: number;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 6, default: 0 })
  lat: number;

  @Field()
  @Column({ type: 'decimal', precision: 10, scale: 6, default: 0 })
  long: number;
  
  @Field()
  @Column({ select: false, insert: false, readonly: true, update: false })
  distance: number;

  @Field()
  @Column({ default: false })
  isArchive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
