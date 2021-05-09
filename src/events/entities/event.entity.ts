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
}

export enum state {
  Draft,
  Active,
  Achieved,
}

registerEnumType(eventType, {
  name: 'eventType',
});

registerEnumType(state, {
  name: 'state',
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
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  user: User;

  @Field()
  @Column({ nullable: false })
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ nullable: false, default: eventType.Party })
  type: eventType;

  @Field()
  @Column({ nullable: false, default: state.Draft })
  state: state;

  @Field()
  @Column({ nullable: false })
  startDate: Date;

  @Field()
  @Column({ nullable: false })
  endDate: Date;

  @Field()
  @Column({ nullable: true })
  maxParticipants: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
