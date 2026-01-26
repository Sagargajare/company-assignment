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
   * Returns questions with translations applied for the specified language
   * @param language Language code ('en', 'hi', etc.). Defaults to 'en'
   * @returns Array of quiz questions in the specified language
   */
  async getQuizSchema(language: string = 'en'): Promise<QuizSchema[]> {
    try {
      const questions = await this.quizSchemaRepository.find({
        order: {
          order_index: 'ASC',
        },
      });

      // Apply translations to questions
      const translatedQuestions = questions.map((question) => {
        // Create a copy of the question
        const translatedQuestion = { ...question };

        // If translations exist, apply them
        if (question.translations) {
          // Apply question text translation
          if (question.translations.question_text && question.translations.question_text[language]) {
            translatedQuestion.question_text = question.translations.question_text[language];
          }

          // Apply options translation
          if (question.translations.options && question.translations.options[language]) {
            translatedQuestion.options = question.translations.options[language];
          }
        }

        return translatedQuestion;
      });

      // Validate that questions requiring options have them
      const questionsRequiringOptions = ['radio', 'checkbox', 'select'];
      for (const question of translatedQuestions) {
        if (questionsRequiringOptions.includes(question.question_type)) {
          if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
            throw new Error(
              `Question "${question.question_id}" (${question.question_type}) requires options but none are provided`
            );
          }
        }
      }

      return translatedQuestions;
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

