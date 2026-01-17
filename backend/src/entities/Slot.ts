import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index,
  Check,
} from 'typeorm';
import { Coach } from './Coach';
import { Booking } from './Booking';

@Entity('slots')
@Index(['coach_id'])
@Index(['status'])
@Index(['start_time', 'end_time'])
@Check(`"end_time" > "start_time"`)
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  coach_id!: string;

  @Column({ type: 'timestamptz' })
  start_time!: Date;

  @Column({ type: 'timestamptz' })
  end_time!: Date;

  @Column({ type: 'varchar', length: 50 })
  timezone!: string;

  @Column({ type: 'varchar', length: 20, default: 'available' })
  status!: string; // 'available', 'booked', 'cancelled'

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  // Relations
  @ManyToOne(() => Coach, (coach) => coach.slots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coach_id' })
  coach!: Coach;

  @OneToOne(() => Booking, (booking) => booking.slot)
  booking?: Booking;
}

