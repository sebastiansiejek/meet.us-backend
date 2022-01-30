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
  Social,
}

registerEnumType(eventType, {
  name: 'eventType',
});

@ObjectType()
@Entity({
  name: 'tags',
})
export class Tag {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ nullable: false })
  type: eventType;

  @Field()
  @Column({ nullable: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
