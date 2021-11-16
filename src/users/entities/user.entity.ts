import { ObjectType, Field } from '@nestjs/graphql';
import { Company } from 'src/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
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

  @OneToOne(() => Company, company => company.id, {cascade: true})
  @JoinColumn({name: 'company', referencedColumnName: 'id'})
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
