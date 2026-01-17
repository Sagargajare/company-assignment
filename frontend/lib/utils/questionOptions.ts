// Question Options Mapping
// Maps question_id to available options for radio/checkbox questions
// Based on the risk score service expected values

export interface QuestionOption {
  value: string;
  label: string;
}

export const QUESTION_OPTIONS: Record<string, QuestionOption[]> = {
  family_history: [
    { value: 'no', label: 'No family history' },
    { value: 'maternal', label: 'Maternal side' },
    { value: 'paternal', label: 'Paternal side' },
    { value: 'both', label: 'Both sides' },
    { value: 'yes', label: 'Yes (unspecified)' },
  ],

  medical_history: [
    { value: 'PCOS', label: 'PCOS (Polycystic Ovary Syndrome)' },
    { value: 'thyroid', label: 'Thyroid issues' },
    { value: 'hypothyroidism', label: 'Hypothyroidism' },
    { value: 'hyperthyroidism', label: 'Hyperthyroidism' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'anaemia', label: 'Anaemia' },
    { value: 'anemia', label: 'Anemia' },
    { value: 'autoimmune', label: 'Autoimmune condition' },
    { value: 'none', label: 'None' },
  ],

  weight_concern: [
    { value: 'none', label: 'No concerns' },
    { value: 'fluctuating', label: 'Weight fluctuations' },
    { value: 'rapid_gain', label: 'Rapid weight gain' },
    { value: 'difficulty_losing', label: 'Difficulty losing weight' },
  ],

  digestion: [
    { value: 'good', label: 'Good' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'irregular', label: 'Irregular' },
    { value: 'poor', label: 'Poor' },
  ],

  vitamin_deficiency: [
    { value: 'Vitamin D', label: 'Vitamin D' },
    { value: 'Vitamin B12', label: 'Vitamin B12' },
    { value: 'Iron', label: 'Iron' },
    { value: 'Folate', label: 'Folate' },
    { value: 'Zinc', label: 'Zinc' },
    { value: 'multiple', label: 'Multiple deficiencies' },
    { value: 'none', label: 'None' },
  ],

  stress_level: [
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
    { value: 'very_high', label: 'Very High' },
    { value: 'extreme', label: 'Extreme' },
  ],

  sleep_quality: [
    { value: 'good', label: 'Good' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'poor', label: 'Poor' },
    { value: 'insomnia', label: 'Insomnia' },
  ],

  work_life_balance: [
    { value: 'good', label: 'Good' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'poor', label: 'Poor' },
    { value: 'none', label: 'None' },
  ],

  diet_quality: [
    { value: 'healthy', label: 'Healthy' },
    { value: 'good', label: 'Good' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'poor', label: 'Poor' },
    { value: 'junk_food', label: 'Mostly junk food' },
  ],

  exercise: [
    { value: 'regular', label: 'Regular (3+ times/week)' },
    { value: 'occasional', label: 'Occasional (1-2 times/week)' },
    { value: 'rarely', label: 'Rarely' },
    { value: 'none', label: 'None' },
  ],

  hair_care_practices: [
    { value: 'excessive_heat', label: 'Excessive heat styling' },
    { value: 'chemical_treatments', label: 'Chemical treatments (dyes, perms)' },
    { value: 'tight_hairstyles', label: 'Tight hairstyles (ponytails, braids)' },
    { value: 'none', label: 'None of the above' },
  ],

  environment: [
    { value: 'clean', label: 'Clean' },
    { value: 'hard_water', label: 'Hard water area' },
    { value: 'polluted', label: 'Polluted area' },
  ],
};

/**
 * Get options for a question by question_id
 */
export function getQuestionOptions(questionId: string): QuestionOption[] | undefined {
  return QUESTION_OPTIONS[questionId];
}

/**
 * Check if a question has predefined options
 */
export function hasQuestionOptions(questionId: string): boolean {
  return questionId in QUESTION_OPTIONS;
}

