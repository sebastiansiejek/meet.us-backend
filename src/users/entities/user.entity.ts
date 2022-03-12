import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Company } from '../../companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Sex {
  Female,
  Male,
}

registerEnumType(Sex, {
  name: 'sex',
});

@ObjectType()
@Entity({
  name: 'users',
})
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ unique: false, nullable: true })
  lastname: string;

  @Field({ nullable: false })
  @Column({ unique: true, nullable: false })
  email: string;

  @Field()
  @Column({ default: false })
  isActive: boolean;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  nickname: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  sex: Sex;

  @Field({ nullable: true })
  @Column('mediumtext', { nullable: true })
  description: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  refreshTokenExpires: Date;

  @Field({ nullable: true })
  @OneToOne(() => Company, (company) => company.user)
  company?: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
