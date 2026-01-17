import { Request, Response } from 'express';
import { QuizService } from '../services/quiz.service';
import { QuizSchemaResponse, ErrorResponse } from '../dto/quiz.dto';

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
}

