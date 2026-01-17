/**
 * Risk Score Calculation Service
 * Calculates a risk score (0-100) based on quiz responses
 * Considers: genetics, metabolism, stress, medical history, and other factors
 */

interface QuizAnswer {
  question_id: string;
  answer: string | string[] | number;
}

export class RiskScoreService {
  /**
   * Calculate risk score from quiz responses
   * @param responses Array of quiz responses
   * @returns Risk score from 0-100
   */
  calculateRiskScore(responses: QuizAnswer[]): number {
    let riskScore = 0;

    // Create a map for easy lookup
    const answersMap = new Map<string, string | string[] | number>();
    responses.forEach((response) => {
      answersMap.set(response.question_id, response.answer);
    });

    // 1. Genetics factors (weight: 15 points)
    riskScore += this.calculateGeneticsScore(answersMap);

    // 2. Medical history (weight: 25 points)
    riskScore += this.calculateMedicalHistoryScore(answersMap);

    // 3. Metabolism factors (weight: 20 points)
    riskScore += this.calculateMetabolismScore(answersMap);

    // 4. Stress levels (weight: 20 points)
    riskScore += this.calculateStressScore(answersMap);

    // 5. Lifestyle factors (weight: 20 points)
    riskScore += this.calculateLifestyleScore(answersMap);

    // Ensure score is between 0 and 100
    return Math.min(100, Math.max(0, riskScore));
  }

  /**
   * Calculate genetics-based risk score
   */
  private calculateGeneticsScore(answersMap: Map<string, string | string[] | number>): number {
    let score = 0;

    // Family history of hair loss
    const familyHistory = answersMap.get('family_history') as string;
    if (familyHistory === 'yes' || familyHistory === 'maternal' || familyHistory === 'paternal') {
      score += 15;
    } else if (familyHistory === 'both') {
      score += 20;
    }

    // Age factor (older = higher risk)
    const age = answersMap.get('age') as number;
    if (typeof age === 'number') {
      if (age >= 40) score += 5;
      else if (age >= 30) score += 3;
      else if (age >= 25) score += 2;
    }

    // Ensure max 15 points for genetics
    return Math.min(15, score);
  }

  /**
   * Calculate medical history-based risk score
   */
  private calculateMedicalHistoryScore(answersMap: Map<string, string | string[] | number>): number {
    let score = 0;

    const medicalHistory = answersMap.get('medical_history') as string | string[];

    if (Array.isArray(medicalHistory)) {
      // Multiple conditions increase risk
      medicalHistory.forEach((condition) => {
        switch (condition.toLowerCase()) {
          case 'pcos':
          case 'polycystic ovary syndrome':
            score += 10;
            break;
          case 'thyroid':
          case 'hypothyroidism':
          case 'hyperthyroidism':
            score += 8;
            break;
          case 'diabetes':
            score += 7;
            break;
          case 'anaemia':
          case 'anemia':
            score += 6;
            break;
          case 'autoimmune':
            score += 8;
            break;
        }
      });
    } else if (typeof medicalHistory === 'string') {
      // Single condition
      switch (medicalHistory.toLowerCase()) {
        case 'pcos':
        case 'polycystic ovary syndrome':
          score += 10;
          break;
        case 'thyroid':
        case 'hypothyroidism':
        case 'hyperthyroidism':
          score += 8;
          break;
        case 'diabetes':
          score += 7;
          break;
        case 'anaemia':
        case 'anemia':
          score += 6;
          break;
        case 'autoimmune':
          score += 8;
          break;
      }
    }

    // Ensure max 25 points for medical history
    return Math.min(25, score);
  }

  /**
   * Calculate metabolism-based risk score
   */
  private calculateMetabolismScore(answersMap: Map<string, string | string[] | number>): number {
    let score = 0;

    // Weight/BMI factors
    const weight = answersMap.get('weight_concern') as string;
    if (weight === 'rapid_gain' || weight === 'difficulty_losing') {
      score += 10;
    } else if (weight === 'fluctuating') {
      score += 5;
    }

    // Digestive issues
    const digestion = answersMap.get('digestion') as string;
    if (digestion === 'poor' || digestion === 'irregular') {
      score += 8;
    } else if (digestion === 'moderate') {
      score += 4;
    }

    // Vitamin deficiencies
    const vitamins = answersMap.get('vitamin_deficiency') as string | string[];
    if (Array.isArray(vitamins) && vitamins.length > 0) {
      score += Math.min(10, vitamins.length * 3);
    } else if (vitamins === 'yes' || vitamins === 'multiple') {
      score += 10;
    }

    // Ensure max 20 points for metabolism
    return Math.min(20, score);
  }

  /**
   * Calculate stress-based risk score
   */
  private calculateStressScore(answersMap: Map<string, string | string[] | number>): number {
    let score = 0;

    // Stress level
    const stressLevel = answersMap.get('stress_level') as string;
    switch (stressLevel) {
      case 'very_high':
      case 'extreme':
        score += 20;
        break;
      case 'high':
        score += 15;
        break;
      case 'moderate':
        score += 8;
        break;
      case 'low':
        score += 3;
        break;
    }

    // Sleep quality
    const sleep = answersMap.get('sleep_quality') as string;
    if (sleep === 'poor' || sleep === 'insomnia') {
      score += 5;
    } else if (sleep === 'moderate') {
      score += 2;
    }

    // Work-life balance
    const workLife = answersMap.get('work_life_balance') as string;
    if (workLife === 'poor' || workLife === 'none') {
      score += 5;
    }

    // Ensure max 20 points for stress
    return Math.min(20, score);
  }

  /**
   * Calculate lifestyle-based risk score
   */
  private calculateLifestyleScore(answersMap: Map<string, string | string[] | number>): number {
    let score = 0;

    // Diet quality
    const diet = answersMap.get('diet_quality') as string;
    if (diet === 'poor' || diet === 'junk_food') {
      score += 8;
    } else if (diet === 'moderate') {
      score += 4;
    }

    // Exercise level
    const exercise = answersMap.get('exercise') as string;
    if (exercise === 'none' || exercise === 'rarely') {
      score += 6;
    } else if (exercise === 'occasional') {
      score += 3;
    }

    // Hair care practices
    const hairCare = answersMap.get('hair_care_practices') as string | string[];
    if (Array.isArray(hairCare)) {
      if (hairCare.includes('excessive_heat') || hairCare.includes('chemical_treatments')) {
        score += 4;
      }
      if (hairCare.includes('tight_hairstyles')) {
        score += 2;
      }
    }

    // Environmental factors
    const environment = answersMap.get('environment') as string;
    if (environment === 'polluted' || environment === 'hard_water') {
      score += 3;
    }

    // Ensure max 20 points for lifestyle
    return Math.min(20, score);
  }
}

