import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Event } from 'src/events/entities/event.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum participationType {
  Interested,
  Going,
  Canceled,
}

registerEnumType(participationType, {
  name: 'participationType',
});

@ObjectType()
@Entity({
  name: 'participants',
})
export class Participant{
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Field()
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  user: User;

  @Field()
  @ManyToOne(() => Event, { nullable: false })
  @JoinColumn({ name: 'event', referencedColumnName: 'id' })
  event: Event;
  
  @Field()
  @Column({ nullable: false })
  type: participationType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
