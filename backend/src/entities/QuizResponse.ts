import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from './User';
import { QuizSchema } from './QuizSchema';

@Entity('quiz_responses')
@Unique(['user_id', 'question_id'])
@Index(['user_id'])
@Index(['question_id'])
export class QuizResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 100 })
  question_id!: string;

  @Column({ type: 'jsonb' })
  answer!: string | string[] | number; // Can store single value or array

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.quiz_responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // Note: This is a logical relationship, not a foreign key constraint
  // We store question_id as string, not UUID, to reference quiz_schema.question_id
  quiz_schema?: QuizSchema;
}

