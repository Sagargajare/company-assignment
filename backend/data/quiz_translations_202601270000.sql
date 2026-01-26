-- Add Hindi translations to existing quiz questions
-- This should be run after the AddTranslationsToQuizSchema migration

-- Question 1: Age
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "What is your age?",
    "hi": "आपकी उम्र क्या है?"
  }
}'::jsonb
WHERE question_id = 'age';

-- Question 2: Family History
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "Do you have a family history of hair loss?",
    "hi": "क्या आपके परिवार में बालों के झड़ने का इतिहास है?"
  },
  "options": {
    "en": [
      {"label": "No family history", "value": "no"},
      {"label": "Maternal side", "value": "maternal"},
      {"label": "Paternal side", "value": "paternal"},
      {"label": "Both sides", "value": "both"},
      {"label": "Yes (unspecified)", "value": "yes"}
    ],
    "hi": [
      {"label": "कोई पारिवारिक इतिहास नहीं", "value": "no"},
      {"label": "मातृ पक्ष", "value": "maternal"},
      {"label": "पितृ पक्ष", "value": "paternal"},
      {"label": "दोनों पक्ष", "value": "both"},
      {"label": "हां (अनिर्दिष्ट)", "value": "yes"}
    ]
  }
}'::jsonb
WHERE question_id = 'family_history';

-- Question 3: Medical History
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "Do you have any of the following medical conditions? (Select all that apply)",
    "hi": "क्या आपको निम्नलिखित में से कोई चिकित्सा स्थिति है? (सभी लागू का चयन करें)"
  },
  "options": {
    "en": [
      {"label": "PCOS (Polycystic Ovary Syndrome)", "value": "PCOS"},
      {"label": "Thyroid issues", "value": "thyroid"},
      {"label": "Hypothyroidism", "value": "hypothyroidism"},
      {"label": "Hyperthyroidism", "value": "hyperthyroidism"},
      {"label": "Diabetes", "value": "diabetes"},
      {"label": "Anaemia", "value": "anaemia"},
      {"label": "Anemia", "value": "anemia"},
      {"label": "Autoimmune condition", "value": "autoimmune"},
      {"label": "None", "value": "none"}
    ],
    "hi": [
      {"label": "पीसीओएस (पॉलीसिस्टिक ओवरी सिंड्रोम)", "value": "PCOS"},
      {"label": "थायराइड समस्याएं", "value": "thyroid"},
      {"label": "हाइपोथायरायडिज्म", "value": "hypothyroidism"},
      {"label": "हाइपरथायरायडिज्म", "value": "hyperthyroidism"},
      {"label": "मधुमेह", "value": "diabetes"},
      {"label": "एनीमिया", "value": "anaemia"},
      {"label": "एनीमिया", "value": "anemia"},
      {"label": "ऑटोइम्यून स्थिति", "value": "autoimmune"},
      {"label": "कोई नहीं", "value": "none"}
    ]
  }
}'::jsonb
WHERE question_id = 'medical_history';

-- Question 4: Weight Concern
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "Have you experienced any weight-related concerns in the past year?",
    "hi": "क्या आपने पिछले वर्ष में वजन से संबंधित कोई चिंता महसूस की है?"
  },
  "options": {
    "en": [
      {"label": "No concerns", "value": "none"},
      {"label": "Weight fluctuations", "value": "fluctuating"},
      {"label": "Rapid weight gain", "value": "rapid_gain"},
      {"label": "Difficulty losing weight", "value": "difficulty_losing"}
    ],
    "hi": [
      {"label": "कोई चिंता नहीं", "value": "none"},
      {"label": "वजन में उतार-चढ़ाव", "value": "fluctuating"},
      {"label": "तेजी से वजन बढ़ना", "value": "rapid_gain"},
      {"label": "वजन कम करने में कठिनाई", "value": "difficulty_losing"}
    ]
  }
}'::jsonb
WHERE question_id = 'weight_concern';

-- Question 5: Digestion
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "How would you describe your digestive health?",
    "hi": "आप अपने पाचन स्वास्थ्य का वर्णन कैसे करेंगे?"
  },
  "options": {
    "en": [
      {"label": "Good", "value": "good"},
      {"label": "Moderate", "value": "moderate"},
      {"label": "Irregular", "value": "irregular"},
      {"label": "Poor", "value": "poor"}
    ],
    "hi": [
      {"label": "अच्छा", "value": "good"},
      {"label": "मध्यम", "value": "moderate"},
      {"label": "अनियमित", "value": "irregular"},
      {"label": "खराब", "value": "poor"}
    ]
  }
}'::jsonb
WHERE question_id = 'digestion';

-- Question 6: Vitamin Deficiency
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "Have you been diagnosed with any vitamin deficiencies? (Select all that apply)",
    "hi": "क्या आपको किसी विटामिन की कमी का निदान किया गया है? (सभी लागू का चयन करें)"
  },
  "options": {
    "en": [
      {"label": "Vitamin D", "value": "Vitamin D"},
      {"label": "Vitamin B12", "value": "Vitamin B12"},
      {"label": "Iron", "value": "Iron"},
      {"label": "Folate", "value": "Folate"},
      {"label": "Zinc", "value": "Zinc"},
      {"label": "Multiple deficiencies", "value": "multiple"},
      {"label": "None", "value": "none"}
    ],
    "hi": [
      {"label": "विटामिन डी", "value": "Vitamin D"},
      {"label": "विटामिन बी12", "value": "Vitamin B12"},
      {"label": "आयरन", "value": "Iron"},
      {"label": "फोलेट", "value": "Folate"},
      {"label": "जिंक", "value": "Zinc"},
      {"label": "कई कमियां", "value": "multiple"},
      {"label": "कोई नहीं", "value": "none"}
    ]
  }
}'::jsonb
WHERE question_id = 'vitamin_deficiency';

-- Question 7: Stress Level
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "How would you rate your current stress levels?",
    "hi": "आप अपने वर्तमान तनाव स्तर को कैसे रेट करेंगे?"
  },
  "options": {
    "en": [
      {"label": "Low", "value": "low"},
      {"label": "Moderate", "value": "moderate"},
      {"label": "High", "value": "high"},
      {"label": "Very High", "value": "very_high"},
      {"label": "Extreme", "value": "extreme"}
    ],
    "hi": [
      {"label": "कम", "value": "low"},
      {"label": "मध्यम", "value": "moderate"},
      {"label": "उच्च", "value": "high"},
      {"label": "बहुत उच्च", "value": "very_high"},
      {"label": "अत्यधिक", "value": "extreme"}
    ]
  }
}'::jsonb
WHERE question_id = 'stress_level';

-- Question 8: Sleep Quality
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "How would you describe your sleep quality?",
    "hi": "आप अपनी नींद की गुणवत्ता का वर्णन कैसे करेंगे?"
  },
  "options": {
    "en": [
      {"label": "Good", "value": "good"},
      {"label": "Moderate", "value": "moderate"},
      {"label": "Poor", "value": "poor"},
      {"label": "Insomnia", "value": "insomnia"}
    ],
    "hi": [
      {"label": "अच्छा", "value": "good"},
      {"label": "मध्यम", "value": "moderate"},
      {"label": "खराब", "value": "poor"},
      {"label": "अनिद्रा", "value": "insomnia"}
    ]
  }
}'::jsonb
WHERE question_id = 'sleep_quality';

-- Question 9: Work-Life Balance
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "How would you describe your work-life balance?",
    "hi": "आप अपने कार्य-जीवन संतुलन का वर्णन कैसे करेंगे?"
  },
  "options": {
    "en": [
      {"label": "Good", "value": "good"},
      {"label": "Moderate", "value": "moderate"},
      {"label": "Poor", "value": "poor"},
      {"label": "None", "value": "none"}
    ],
    "hi": [
      {"label": "अच्छा", "value": "good"},
      {"label": "मध्यम", "value": "moderate"},
      {"label": "खराब", "value": "poor"},
      {"label": "कोई नहीं", "value": "none"}
    ]
  }
}'::jsonb
WHERE question_id = 'work_life_balance';

-- Question 10: Diet Quality
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "How would you describe your diet?",
    "hi": "आप अपने आहार का वर्णन कैसे करेंगे?"
  },
  "options": {
    "en": [
      {"label": "Healthy", "value": "healthy"},
      {"label": "Good", "value": "good"},
      {"label": "Moderate", "value": "moderate"},
      {"label": "Poor", "value": "poor"},
      {"label": "Mostly junk food", "value": "junk_food"}
    ],
    "hi": [
      {"label": "स्वस्थ", "value": "healthy"},
      {"label": "अच्छा", "value": "good"},
      {"label": "मध्यम", "value": "moderate"},
      {"label": "खराब", "value": "poor"},
      {"label": "ज्यादातर जंक फूड", "value": "junk_food"}
    ]
  }
}'::jsonb
WHERE question_id = 'diet_quality';

-- Question 11: Exercise
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "How often do you exercise?",
    "hi": "आप कितनी बार व्यायाम करते हैं?"
  },
  "options": {
    "en": [
      {"label": "Regular (3+ times/week)", "value": "regular"},
      {"label": "Occasional (1-2 times/week)", "value": "occasional"},
      {"label": "Rarely", "value": "rarely"},
      {"label": "None", "value": "none"}
    ],
    "hi": [
      {"label": "नियमित (सप्ताह में 3+ बार)", "value": "regular"},
      {"label": "कभी-कभार (सप्ताह में 1-2 बार)", "value": "occasional"},
      {"label": "कभी-कभी", "value": "rarely"},
      {"label": "कोई नहीं", "value": "none"}
    ]
  }
}'::jsonb
WHERE question_id = 'exercise';

-- Question 12: Hair Care Practices
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "Which of the following hair care practices do you regularly use? (Select all that apply)",
    "hi": "आप नियमित रूप से निम्नलिखित में से कौन सी बाल देखभाल प्रथाओं का उपयोग करते हैं? (सभी लागू का चयन करें)"
  },
  "options": {
    "en": [
      {"label": "Excessive heat styling", "value": "excessive_heat"},
      {"label": "Chemical treatments (dyes, perms)", "value": "chemical_treatments"},
      {"label": "Tight hairstyles (ponytails, braids)", "value": "tight_hairstyles"},
      {"label": "None of the above", "value": "none"}
    ],
    "hi": [
      {"label": "अत्यधिक गर्मी स्टाइलिंग", "value": "excessive_heat"},
      {"label": "रासायनिक उपचार (डाई, पर्म)", "value": "chemical_treatments"},
      {"label": "कसी हुई हेयरस्टाइल (पोनीटेल, ब्रेड)", "value": "tight_hairstyles"},
      {"label": "इनमें से कोई नहीं", "value": "none"}
    ]
  }
}'::jsonb
WHERE question_id = 'hair_care_practices';

-- Question 13: Environment
UPDATE public.quiz_schema
SET translations = '{
  "question_text": {
    "en": "How would you describe the water and air quality in your area?",
    "hi": "आप अपने क्षेत्र में पानी और हवा की गुणवत्ता का वर्णन कैसे करेंगे?"
  },
  "options": {
    "en": [
      {"label": "Clean", "value": "clean"},
      {"label": "Hard water area", "value": "hard_water"},
      {"label": "Polluted area", "value": "polluted"}
    ],
    "hi": [
      {"label": "स्वच्छ", "value": "clean"},
      {"label": "कठोर पानी क्षेत्र", "value": "hard_water"},
      {"label": "प्रदूषित क्षेत्र", "value": "polluted"}
    ]
  }
}'::jsonb
WHERE question_id = 'environment';

