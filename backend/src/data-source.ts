import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User, QuizSchema, QuizResponse, Coach, Slot, Booking } from './entities';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'traya_user',
  password: process.env.DB_PASSWORD || 'traya_password',
  database: process.env.DB_NAME || 'traya_db',
  synchronize: false, // Never use synchronize in production - use migrations
  logging: process.env.NODE_ENV === 'development',
  entities: [User, QuizSchema, QuizResponse, Coach, Slot, Booking],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false,
  },
});

