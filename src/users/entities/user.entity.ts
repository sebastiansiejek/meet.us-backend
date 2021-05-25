import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({
  name: 'users',
})
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ nullable: true })
  firstName: string;

  @Field()
  @Column({ unique: false, nullable: true })
  lastname: string;

  @Field()
  @Column({ unique: true, nullable: false })
  email: string;

  @Field()
  @Column({ default: false })
  isActive: boolean;

  @Field()
  @Column({ unique: true, nullable: true })
  nickname: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
