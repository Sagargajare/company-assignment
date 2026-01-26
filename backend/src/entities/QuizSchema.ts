import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { QuizResponse } from './QuizResponse';

@Entity('quiz_schema')
@Index(['question_id'], { unique: true })
@Index(['order_index'])
export class QuizSchema {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  question_id!: string;

  @Column({ type: 'text' })
  question_text!: string;

  @Column({ type: 'varchar', length: 50 })
  question_type!: string; // 'radio', 'checkbox', 'select', 'text', 'number'

  @Column({ type: 'jsonb', nullable: true })
  branching_rules?: Record<string, any>; // {"if": "PCOS", "then": ["q5", "q6"], "else": ["q7"]}

  @Column({ type: 'jsonb', nullable: true })
  options?: Array<{ value: string; label: string }>; // Options for radio/checkbox questions

  @Column({ type: 'jsonb', nullable: true })
  translations?: {
    question_text?: Record<string, string>; // {"en": "English text", "hi": "Hindi text"}
    options?: Record<string, Array<{ value: string; label: string }>>; // {"en": [...], "hi": [...]}
  };

  @Column({ type: 'int' })
  order_index!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  // Relations
  @OneToMany(() => QuizResponse, (quizResponse) => quizResponse.quiz_schema)
  quiz_responses!: QuizResponse[];
}

