import { Coach } from '../entities';

/**
 * Coach Matching Service
 * Matches risk score to appropriate coach seniority level
 * - High risk (61-100) → Senior coaches
 * - Medium risk (31-60) → Mid-level coaches
 * - Low risk (0-30) → Junior coaches
 */
export class CoachMatchingService {
  /**
   * Get required coach seniority level based on risk score
   * @param riskScore Risk score (0-100)
   * @returns Required seniority level
   */
  getRequiredSeniorityLevel(riskScore: number): string {
    if (riskScore >= 61) {
      return 'senior';
    } else if (riskScore >= 31) {
      return 'mid';
    } else {
      return 'junior';
    }
  }

  /**
   * Filter coaches based on risk score
   * Returns coaches with matching or higher seniority level
   * @param coaches Array of coaches
   * @param riskScore Risk score (0-100)
   * @returns Filtered array of coaches
   */
  filterCoachesByRiskScore(coaches: Coach[], riskScore: number): Coach[] {
    const requiredLevel = this.getRequiredSeniorityLevel(riskScore);
    
    // Define seniority hierarchy (higher number = higher seniority)
    const seniorityHierarchy: Record<string, number> = {
      junior: 1,
      mid: 2,
      senior: 3,
    };

    const requiredLevelValue = seniorityHierarchy[requiredLevel] || 1;

    // Filter coaches with matching or higher seniority
    return coaches.filter((coach) => {
      const coachLevel = seniorityHierarchy[coach.seniority_level] || 0;
      return coachLevel >= requiredLevelValue;
    });
  }

  /**
   * Filter coaches by language preference
   * @param coaches Array of coaches
   * @param language Language preference (e.g., 'en', 'hi')
   * @returns Filtered array of coaches
   */
  filterCoachesByLanguage(coaches: Coach[], language: string): Coach[] {
    if (!language) {
      return coaches; // Return all if no language preference
    }

    return coaches.filter((coach) => {
      if (Array.isArray(coach.languages)) {
        return coach.languages.includes(language);
      }
      return false;
    });
  }

  /**
   * Match coaches based on risk score and optional filters
   * @param coaches Array of all coaches
   * @param riskScore Risk score (0-100)
   * @param language Optional language preference
   * @returns Matched coaches
   */
  matchCoaches(coaches: Coach[], riskScore: number, language?: string): Coach[] {
    // First filter by risk score (seniority level)
    let matchedCoaches = this.filterCoachesByRiskScore(coaches, riskScore);

    // Then filter by language if provided
    if (language) {
      matchedCoaches = this.filterCoachesByLanguage(matchedCoaches, language);
    }

    return matchedCoaches;
  }
}

