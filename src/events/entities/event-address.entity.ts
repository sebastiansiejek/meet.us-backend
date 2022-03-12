import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';

@ObjectType()
@Entity({
  name: 'event_address',
})
export class EventAddress {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Event, (event) => event.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event', referencedColumnName: 'id' })
  event: Event;

  @Field({ nullable: true })
  @Column({ nullable: true })
  label: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  countryCode: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  countryName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  state: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  county: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  city: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  district: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  postalCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
