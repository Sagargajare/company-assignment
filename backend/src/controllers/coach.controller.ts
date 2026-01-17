import { Request, Response } from 'express';
import { CoachService } from '../services/coach.service';
import { AvailableCoachesResponse, GetAvailableCoachesQuerySchema } from '../dto/coach.dto';
import { ErrorResponse } from '../dto/quiz.dto';
import { CoachMatchingService } from '../services/coachMatching.service';

export class CoachController {
  private coachService: CoachService;
  private coachMatchingService: CoachMatchingService;

  constructor() {
    this.coachService = new CoachService();
    this.coachMatchingService = new CoachMatchingService();
  }

  /**
   * GET /api/coaches/available
   * Get available coaches based on risk score and optional language preference
   * Query params: risk_score (required), language (optional)
   */
  getAvailableCoaches = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate query parameters
      const validationResult = GetAvailableCoachesQuerySchema.safeParse(req.query);

      if (!validationResult.success) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Invalid query parameters',
          message: validationResult.error.issues
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join(', '),
        };
        res.status(400).json(errorResponse);
        return;
      }

      const { risk_score, language } = validationResult.data;

      // Get matched coaches
      const coaches = await this.coachService.getAvailableCoaches(risk_score, language);

      // Get required seniority level
      const requiredSeniority = this.coachMatchingService.getRequiredSeniorityLevel(risk_score);

      const response: AvailableCoachesResponse = {
        success: true,
        data: coaches.map((coach) => ({
          id: coach.id,
          name: coach.name,
          specialization: coach.specialization || null,
          seniority_level: coach.seniority_level,
          languages: Array.isArray(coach.languages) ? coach.languages : [],
          timezone: coach.timezone,
          created_at: coach.created_at,
        })),
        filters: {
          risk_score,
          required_seniority: requiredSeniority,
          ...(language && { language }),
        },
      };

      // Add message if no coaches found
      if (coaches.length === 0) {
        response.message = 'No coaches available for the given risk score and filters.';
      }

      res.status(200).json(response);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get available coaches',
      };

      // Handle validation errors
      if (error instanceof Error && error.message.includes('must be between')) {
        res.status(400).json(errorResponse);
        return;
      }

      res.status(500).json(errorResponse);
    }
  };
}

