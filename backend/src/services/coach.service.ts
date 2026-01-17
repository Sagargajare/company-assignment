import { AppDataSource } from '../data-source';
import { Coach } from '../entities';
import { CoachMatchingService } from './coachMatching.service';

export class CoachService {
  private coachRepository = AppDataSource.getRepository(Coach);
  private coachMatchingService: CoachMatchingService;

  constructor() {
    this.coachMatchingService = new CoachMatchingService();
  }

  /**
   * Get all coaches
   */
  async getAllCoaches(): Promise<Coach[]> {
    try {
      const coaches = await this.coachRepository.find({
        order: {
          seniority_level: 'DESC', // Senior first
          name: 'ASC',
        },
      });

      return coaches;
    } catch (error) {
      throw new Error(`Failed to fetch coaches: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available coaches based on risk score
   * @param riskScore Risk score (0-100)
   * @param language Optional language preference
   * @returns Matched coaches
   */
  async getAvailableCoaches(riskScore: number, language?: string): Promise<Coach[]> {
    try {
      // Validate risk score range
      if (riskScore < 0 || riskScore > 100) {
        throw new Error('Risk score must be between 0 and 100');
      }

      // Get all coaches
      const allCoaches = await this.getAllCoaches();

      // Match coaches based on risk score and language
      const matchedCoaches = this.coachMatchingService.matchCoaches(allCoaches, riskScore, language);

      return matchedCoaches;
    } catch (error) {
      throw new Error(
        `Failed to get available coaches: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get coach by ID
   */
  async getCoachById(coachId: string): Promise<Coach | null> {
    try {
      const coach = await this.coachRepository.findOne({
        where: { id: coachId },
      });

      return coach || null;
    } catch (error) {
      throw new Error(`Failed to fetch coach: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

