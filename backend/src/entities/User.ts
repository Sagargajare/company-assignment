import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { QuizResponse } from './QuizResponse';
import { Booking } from './Booking';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone!: string;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  language_preference!: string; // 'en' or 'hi'

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  // Relations
  @OneToMany(() => QuizResponse, (quizResponse) => quizResponse.user)
  quiz_responses!: QuizResponse[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings!: Booking[];
}

