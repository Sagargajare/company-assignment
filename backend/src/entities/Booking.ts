import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
  Unique,
  Check,
} from 'typeorm';
import { User } from './User';
import { Slot } from './Slot';

@Entity('bookings')
@Unique(['slot_id'])
@Index(['user_id'])
@Index(['slot_id'])
@Index(['status'])
@Check(`"quiz_risk_score" >= 0 AND "quiz_risk_score" <= 100`)
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid', unique: true })
  slot_id!: string;

  @Column({ type: 'int' })
  quiz_risk_score!: number; // 0-100

  @Column({ type: 'varchar', length: 20, default: 'confirmed' })
  status!: string; // 'confirmed', 'cancelled', 'completed'

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToOne(() => Slot, (slot) => slot.booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'slot_id' })
  slot!: Slot;
}

