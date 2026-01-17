import { AppDataSource } from '../data-source';
import { QuizSchema } from '../entities';

export class QuizService {
  private quizSchemaRepository = AppDataSource.getRepository(QuizSchema);

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
}

