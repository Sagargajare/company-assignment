/**
 * Translation files for multilingual support
 * Supports English (en) and Hindi (hi)
 */

export interface Translations {
  // Booking page
  bookYourConsultation: string;
  selectAvailableSlot: string;
  available: string;
  booked: string;
  coach: string;
  confirmBooking: string;
  selectedSlot: string;
  booking: string;
  noSlotsAvailable: string;
  loadingSlots: string;
  
  // Booking confirmation
  bookingConfirmed: string;
  consultationScheduled: string;
  bookingDetails: string;
  dateTime: string;
  coachName: string;
  status: string;
  confirmed: string;
  whatsNext: string;
  receiveEmail: string;
  prepareQuestions: string;
  joinOnTime: string;
  backToHome: string;
  
  // Quiz - User Form
  getStarted: string;
  provideInfoToBeginQuiz: string;
  fullName: string;
  enterYourFullName: string;
  emailAddress: string;
  enterYourEmail: string;
  timezone: string;
  timezoneDefault: string;
  languagePreference: string;
  english: string;
  hindi: string;
  fillAllFields: string;
  enterValidEmail: string;
  creatingAccount: string;
  startQuiz: string;
  creatingAccountLoading: string;
  
  // Quiz - Step Navigation
  questionOf: string;
  previous: string;
  next: string;
  submitQuiz: string;
  submitting: string;
  analyzingAnswers: string;
  
  // Quiz - Input Labels
  errorMissingOptions: string;
  errorMissingOptionsDesc: string;
  selectAnOption: string;
  selectAnOptionPlaceholder: string;
  selectAValue: string;
  selectAValuePlaceholder: string;
  enterANumber: string;
  enterANumberPlaceholder: string;
  enterYourAnswer: string;
  enterYourAnswerPlaceholder: string;
  
  // Quiz - States
  loadingQuestions: string;
  errorLoadingQuiz: string;
  quizCompleted: string;
  yourRiskScore: string;
  proceedToBookConsultation: string;
  bookConsultation: string;
  noQuestionsAvailable: string;
  
  // Common
  pleasewait: string;
  error: string;
  retry: string;
  loading: string;
  
  // Date labels
  today: string;
  tomorrow: string;
  slotsText: string;
  bookAnother: string;
  
  // Days of week
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  
  // Months (short)
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  aug: string;
  sep: string;
  oct: string;
  nov: string;
  dec: string;
}

export const translations: Record<'en' | 'hi', Translations> = {
  en: {
    // Booking page
    bookYourConsultation: 'Book Your Consultation',
    selectAvailableSlot: 'Select an available time slot for your consultation',
    available: 'Available',
    booked: 'Booked',
    coach: 'Coach',
    confirmBooking: 'Confirm Booking',
    selectedSlot: 'Selected Slot',
    booking: 'Booking...',
    noSlotsAvailable: 'No slots available',
    loadingSlots: 'Loading available slots...',
    
    // Booking confirmation
    bookingConfirmed: 'Booking Confirmed!',
    consultationScheduled: 'Your consultation has been scheduled successfully.',
    bookingDetails: 'Booking Details',
    dateTime: 'Date & Time',
    coachName: 'Coach',
    status: 'Status',
    confirmed: 'Confirmed',
    whatsNext: "What's Next?",
    receiveEmail: "You'll receive a confirmation email with joining details",
    prepareQuestions: 'Prepare any questions you have about your hair health',
    joinOnTime: 'Join the consultation at the scheduled time',
    backToHome: 'Back to Home',
    
    // Quiz - User Form
    getStarted: 'Get Started',
    provideInfoToBeginQuiz: 'Please provide your information to begin the quiz',
    fullName: 'Full Name',
    enterYourFullName: 'Enter your full name',
    emailAddress: 'Email Address',
    enterYourEmail: 'Enter your email',
    timezone: 'Timezone',
    timezoneDefault: 'Default: Automatically detected from your browser',
    languagePreference: 'Language Preference',
    english: 'English',
    hindi: 'Hindi',
    fillAllFields: 'Please fill in all required fields',
    enterValidEmail: 'Please enter a valid email address',
    creatingAccount: 'Creating your account...',
    startQuiz: 'Start Quiz',
    creatingAccountLoading: 'Creating Account...',
    
    // Quiz - Step Navigation
    questionOf: 'Question',
    previous: 'Previous',
    next: 'Next',
    submitQuiz: 'Submit Quiz',
    submitting: 'Submitting...',
    analyzingAnswers: 'Analyzing the answers to suggest the best hair coach',
    
    // Quiz - Input Labels
    errorMissingOptions: 'Error: Missing Options',
    errorMissingOptionsDesc: 'This question requires options but none were provided. Please contact support.',
    selectAnOption: 'Select an option:',
    selectAnOptionPlaceholder: '-- Select an option --',
    selectAValue: 'Select a value:',
    selectAValuePlaceholder: '-- Select a value --',
    enterANumber: 'Enter a number:',
    enterANumberPlaceholder: 'Enter a number',
    enterYourAnswer: 'Enter your answer:',
    enterYourAnswerPlaceholder: 'Type your answer here...',
    
    // Quiz - States
    loadingQuestions: 'Loading questions...',
    errorLoadingQuiz: 'Error Loading Quiz',
    quizCompleted: 'Quiz Completed!',
    yourRiskScore: 'Your Risk Score',
    proceedToBookConsultation: 'You can now proceed to book a consultation with a coach.',
    bookConsultation: 'Book Consultation',
    noQuestionsAvailable: 'No questions available.',
    
    // Common
    pleasewait: 'Please wait',
    error: 'Error',
    retry: 'Retry',
    loading: 'Loading',
    
    // Date labels
    today: 'Today',
    tomorrow: 'Tomorrow',
    slotsText: 'slot',
    bookAnother: 'Book Another',
    
    // Days of week
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    
    // Months (short)
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec',
  },
  hi: {
    // Booking page
    bookYourConsultation: 'अपनी परामर्श बुक करें',
    selectAvailableSlot: 'अपने परामर्श के लिए उपलब्ध समय स्लॉट चुनें',
    available: 'उपलब्ध',
    booked: 'बुक किया गया',
    coach: 'कोच',
    confirmBooking: 'बुकिंग की पुष्टि करें',
    selectedSlot: 'चयनित स्लॉट',
    booking: 'बुकिंग हो रही है...',
    noSlotsAvailable: 'कोई स्लॉट उपलब्ध नहीं',
    loadingSlots: 'उपलब्ध स्लॉट लोड हो रहे हैं...',
    
    // Booking confirmation
    bookingConfirmed: 'बुकिंग की पुष्टि हो गई!',
    consultationScheduled: 'आपका परामर्श सफलतापूर्वक निर्धारित किया गया है।',
    bookingDetails: 'बुकिंग विवरण',
    dateTime: 'तारीख और समय',
    coachName: 'कोच',
    status: 'स्थिति',
    confirmed: 'पुष्टि की गई',
    whatsNext: 'आगे क्या?',
    receiveEmail: 'आपको जुड़ने के विवरण के साथ एक पुष्टिकरण ईमेल प्राप्त होगा',
    prepareQuestions: 'अपने बालों के स्वास्थ्य के बारे में कोई भी प्रश्न तैयार करें',
    joinOnTime: 'निर्धारित समय पर परामर्श में शामिल हों',
    backToHome: 'होम पर वापस जाएं',
    
    // Quiz - User Form
    getStarted: 'शुरू करें',
    provideInfoToBeginQuiz: 'क्विज शुरू करने के लिए कृपया अपनी जानकारी प्रदान करें',
    fullName: 'पूरा नाम',
    enterYourFullName: 'अपना पूरा नाम दर्ज करें',
    emailAddress: 'ईमेल पता',
    enterYourEmail: 'अपना ईमेल दर्ज करें',
    timezone: 'समय क्षेत्र',
    timezoneDefault: 'डिफ़ॉल्ट: आपके ब्राउज़र से स्वचालित रूप से पता लगाया गया',
    languagePreference: 'भाषा वरीयता',
    english: 'अंग्रेज़ी',
    hindi: 'हिंदी',
    fillAllFields: 'कृपया सभी आवश्यक फील्ड भरें',
    enterValidEmail: 'कृपया एक मान्य ईमेल पता दर्ज करें',
    creatingAccount: 'आपका खाता बनाया जा रहा है...',
    startQuiz: 'क्विज़ शुरू करें',
    creatingAccountLoading: 'खाता बनाया जा रहा है...',
    
    // Quiz - Step Navigation
    questionOf: 'प्रश्न',
    previous: 'पिछला',
    next: 'अगला',
    submitQuiz: 'क्विज़ सबमिट करें',
    submitting: 'सबमिट किया जा रहा है...',
    analyzingAnswers: 'सर्वोत्तम हेयर कोच सुझाने के लिए उत्तरों का विश्लेषण किया जा रहा है',
    
    // Quiz - Input Labels
    errorMissingOptions: 'त्रुटि: विकल्प गायब हैं',
    errorMissingOptionsDesc: 'इस प्रश्न के लिए विकल्पों की आवश्यकता है लेकिन कोई प्रदान नहीं किया गया। कृपया सहायता से संपर्क करें।',
    selectAnOption: 'एक विकल्प चुनें:',
    selectAnOptionPlaceholder: '-- एक विकल्प चुनें --',
    selectAValue: 'एक मान चुनें:',
    selectAValuePlaceholder: '-- एक मान चुनें --',
    enterANumber: 'एक संख्या दर्ज करें:',
    enterANumberPlaceholder: 'एक संख्या दर्ज करें',
    enterYourAnswer: 'अपना उत्तर दर्ज करें:',
    enterYourAnswerPlaceholder: 'अपना उत्तर यहां टाइप करें...',
    
    // Quiz - States
    loadingQuestions: 'प्रश्न लोड हो रहे हैं...',
    errorLoadingQuiz: 'क्विज़ लोड करने में त्रुटि',
    quizCompleted: 'क्विज़ पूरी हो गई!',
    yourRiskScore: 'आपका जोखिम स्कोर',
    proceedToBookConsultation: 'अब आप कोच के साथ परामर्श बुक करने के लिए आगे बढ़ सकते हैं।',
    bookConsultation: 'परामर्श बुक करें',
    noQuestionsAvailable: 'कोई प्रश्न उपलब्ध नहीं है।',
    
    // Common
    pleasewait: 'कृपया प्रतीक्षा करें',
    error: 'त्रुटि',
    retry: 'पुनः प्रयास करें',
    loading: 'लोड हो रहा है',
    
    // Date labels
    today: 'आज',
    tomorrow: 'कल',
    slotsText: 'स्लॉट',
    bookAnother: 'दूसरी बुकिंग करें',
    
    // Days of week
    monday: 'सोमवार',
    tuesday: 'मंगलवार',
    wednesday: 'बुधवार',
    thursday: 'गुरुवार',
    friday: 'शुक्रवार',
    saturday: 'शनिवार',
    sunday: 'रविवार',
    
    // Months (short)
    jan: 'जन',
    feb: 'फर',
    mar: 'मार्च',
    apr: 'अप्रैल',
    may: 'मई',
    jun: 'जून',
    jul: 'जुल',
    aug: 'अग',
    sep: 'सित',
    oct: 'अक्टू',
    nov: 'नव',
    dec: 'दिस',
  },
};

/**
 * Get translations for a specific language
 */
export function getTranslations(language: 'en' | 'hi'): Translations {
  return translations[language] || translations.en;
}

