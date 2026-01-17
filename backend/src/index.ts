import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Database health check endpoint
app.get('/health/db', async (req: Request, res: Response) => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.query('SELECT 1');
      res.json({ status: 'ok', message: 'Database connection is healthy' });
    } else {
      res.status(503).json({ status: 'error', message: 'Database not initialized' });
    }
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Database connection failed', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connection established');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  });

