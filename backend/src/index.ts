import 'reflect-metadata';
import express, { Express, Request, Response, Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { UserController } from './controllers/user.controller';
import { QuizController } from './controllers/quiz.controller';
import { CoachController } from './controllers/coach.controller';
import { SlotController } from './controllers/slot.controller';
import { BookingController } from './controllers/booking.controller';

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

// API Routes
const apiRouter = Router();
const userController = new UserController();
const quizController = new QuizController();
const coachController = new CoachController();
const slotController = new SlotController();
const bookingController = new BookingController();

// User routes
apiRouter.post('/users', userController.createUser);

// Quiz routes
apiRouter.get('/quiz/schema', quizController.getQuizSchema);
apiRouter.post('/quiz/submit', quizController.submitQuiz);

// Coach routes
apiRouter.get('/coaches/available', coachController.getAvailableCoaches);

// Slot routes
apiRouter.get('/slots/available', slotController.getAvailableSlots);

// Booking routes
apiRouter.post('/bookings/book-slot', bookingController.bookSlot);

// Mount API routes
app.use('/api', apiRouter);

// Initialize database connection
AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Database connection established');
    
    // Run migrations automatically
    try {
      console.log('🔄 Running database migrations...');
      await AppDataSource.runMigrations();
      console.log('✅ Migrations completed successfully');
    } catch (error) {
      console.error('❌ Error running migrations:', error);
      process.exit(1);
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  });

