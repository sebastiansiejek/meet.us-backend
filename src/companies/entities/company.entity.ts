import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({
  name: 'companies',
})
export class Company {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;
  
  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  zipCode: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  nip: string;

  @OneToOne(() => User, user => user.company) // specify inverse side as a second parameter
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
