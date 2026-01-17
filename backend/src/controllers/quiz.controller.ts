import { Request, Response } from 'express';
import { QuizService } from '../services/quiz.service';
import {
  QuizSchemaResponse,
  ErrorResponse,
  SubmitQuizResponse,
  SubmitQuizSchema,
  SubmitQuizRequest,
  QuizProgressResponse,
} from '../dto/quiz.dto';

export class QuizController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService();
  }

  /**
   * GET /api/quiz/schema
   * Returns the dynamic quiz structure from database
   */
  getQuizSchema = async (req: Request, res: Response): Promise<void> => {
    try {
      const questions = await this.quizService.getQuizSchema();

      const response: QuizSchemaResponse = {
        success: true,
        data: questions.map((q) => ({
          id: q.id,
          question_id: q.question_id,
          question_text: q.question_text,
          question_type: q.question_type,
          branching_rules: q.branching_rules || null,
          order_index: q.order_index,
          created_at: q.created_at,
        })),
      };

      // If no questions exist, return empty array with a message
      if (questions.length === 0) {
        response.message = 'No quiz questions found. Please seed the database.';
      }

      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to fetch quiz schema',
      };

      res.status(500).json(errorResponse);
    }
  };

  /**
   * POST /api/quiz/submit
   * Submit quiz responses, calculate risk score, and save to database
   */
  submitQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body using Zod
      const validationResult = SubmitQuizSchema.safeParse(req.body);

      if (!validationResult.success) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Invalid request data',
          message: validationResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
        };
        res.status(400).json(errorResponse);
        return;
      }

      const { user_id, responses }: SubmitQuizRequest = validationResult.data;

      // Validate that responses array is not empty
      if (responses.length === 0) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Invalid request data',
          message: 'At least one quiz response is required',
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Submit quiz and calculate risk score
      const riskScore = await this.quizService.submitQuiz(user_id, responses);

      const response: SubmitQuizResponse = {
        success: true,
        data: {
          risk_score: riskScore,
          user_id: user_id,
          submitted_at: new Date(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to submit quiz',
      };

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json(errorResponse);
          return;
        }
      }

      res.status(500).json(errorResponse);
    }
  };

  /**
   * GET /api/quiz/progress/:userId
   * Get quiz progress for a user to enable resume functionality
   * Returns the last completed question and next question to resume from
   */
  getQuizProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract userId from params, ensuring it's a string
      const userId = typeof req.params.userId === 'string' ? req.params.userId : req.params.userId?.[0] || '';

      // Validate userId is a valid UUID
      if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Invalid user ID',
          message: 'User ID must be a valid UUID',
        };
        res.status(400).json(errorResponse);
        return;
      }

      // Get quiz progress
      const progress = await this.quizService.getQuizProgress(userId);

      const response: QuizProgressResponse = {
        success: true,
        data: progress,
      };

      // Add helpful message if quiz is completed
      if (progress.is_completed) {
        response.message = 'Quiz completed. You can now proceed to booking.';
      } else if (progress.completed_questions > 0) {
        response.message = `Resume from question ${progress.next_question?.order_index || 'N/A'}`;
      } else {
        response.message = 'Quiz not started. Begin with the first question.';
      }

      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get quiz progress',
      };

      // Handle specific error cases
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json(errorResponse);
          return;
        }
      }

      res.status(500).json(errorResponse);
    }
  };
}

