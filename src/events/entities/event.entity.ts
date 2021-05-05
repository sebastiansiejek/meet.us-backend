import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
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
  @Column({ nullable: false, default: eventType.Party })
  type: eventType;

  @Field()
  @Column({ nullable: false, default: state.Draft })
  state: state;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
