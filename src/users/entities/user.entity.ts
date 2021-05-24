import { ObjectType, Field } from '@nestjs/graphql';
import { Image } from 'src/images/entities/image.entity';
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

  @Field()
  @OneToOne(() => Image, { nullable: true })
  @JoinColumn({ name: 'image', referencedColumnName: 'id' })
  image: Image;

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
  @Column({ default: true })
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
