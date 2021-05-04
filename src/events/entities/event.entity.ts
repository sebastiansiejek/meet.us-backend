import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum event_type {
  Sport,
  Party,
}

export enum state {
  Draft,
  Active,
  Achieved,
}

registerEnumType(event_type, {
  name: 'event_type',
});

registerEnumType(state, {
  name: 'state',
});

@ObjectType()
@Entity()
export class Event {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  event_id: string;

  @Field()
  @Column({ nullable: false })
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ nullable: false, default: event_type.Party })
  type: event_type;

  @Field()
  @Column({ nullable: false, default: state.Draft })
  state: state;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  startDate: Date;

  @UpdateDateColumn()
  endDate: Date;
}
