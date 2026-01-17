import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Slot } from './Slot';

@Entity('coaches')
@Index(['seniority_level'])
export class Coach {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  specialization?: string;

  @Column({ type: 'varchar', length: 50 })
  seniority_level!: string; // 'junior', 'mid', 'senior'

  @Column({ type: 'jsonb' })
  languages!: string[]; // ["en", "hi"] or ["en"]

  @Column({ type: 'varchar', length: 50, default: 'Asia/Kolkata' })
  timezone!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  // Relations
  @OneToMany(() => Slot, (slot) => slot.coach)
  slots!: Slot[];
}

