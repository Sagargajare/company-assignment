import { AppDataSource } from '../data-source';
import { QuizSchema, QuizResponse, User } from '../entities';
import { RiskScoreService } from './riskScore.service';

export class QuizService {
  private quizSchemaRepository = AppDataSource.getRepository(QuizSchema);
  private quizResponseRepository = AppDataSource.getRepository(QuizResponse);
  private userRepository = AppDataSource.getRepository(User);
  private riskScoreService: RiskScoreService;

  constructor() {
    this.riskScoreService = new RiskScoreService();
  }

  /**
   * Get all quiz questions ordered by order_index
   * Returns empty array if no questions exist
   */
  async getQuizSchema(): Promise<QuizSchema[]> {
    try {
      const questions = await this.quizSchemaRepository.find({
        order: {
          order_index: 'ASC',
        },
      });

      return questions;
    } catch (error) {
      throw new Error(`Failed to fetch quiz schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a single quiz question by question_id
   */
  async getQuestionById(questionId: string): Promise<QuizSchema | null> {
    try {
      const question = await this.quizSchemaRepository.findOne({
        where: { question_id: questionId },
      });

      return question || null;
    } catch (error) {
      throw new Error(`Failed to fetch question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Submit quiz responses and calculate risk score
   * @param userId User ID
   * @param responses Array of quiz responses
   * @returns Risk score (0-100)
   */
  async submitQuiz(
    userId: string,
    responses: Array<{ question_id: string; answer: string | string[] | number }>
  ): Promise<number> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate risk score
      const riskScore = this.riskScoreService.calculateRiskScore(responses);

      // Save or update each response
      for (const response of responses) {
        // Check if response already exists
        const existingResponse = await this.quizResponseRepository.findOne({
          where: {
            user_id: userId,
            question_id: response.question_id,
          },
        });

        if (existingResponse) {
          // Update existing response
          existingResponse.answer = response.answer;
          await this.quizResponseRepository.save(existingResponse);
        } else {
          // Create new response
          const quizResponse = this.quizResponseRepository.create({
            user_id: userId,
            question_id: response.question_id,
            answer: response.answer,
          });
          await this.quizResponseRepository.save(quizResponse);
        }
      }

      // Commit transaction
      await queryRunner.commitTransaction();

      return riskScore;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw new Error(
        `Failed to submit quiz: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
}

