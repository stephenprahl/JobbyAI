// InterviewPrepPage
export interface InterviewQuestion {
  id: string;
  type: 'behavioral' | 'technical' | 'situational' | 'company_specific';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  category: string;
  tips: string[];
  sampleAnswer?: string;
  followUpQuestions?: string[];
  keywords?: string[];
  industry?: string;
};

export interface InterviewSession {
  id: string;
  jobTitle: string;
  company: string;
  questions: InterviewQuestion[];
  responses: Array<{
    questionId: string;
    response: string;
    duration: number;
    score?: number;
    feedback?: string;
  }>;
  totalDuration: number;
  averageScore: number;
  completedAt?: string;
  mode: 'quick' | 'comprehensive' | 'custom';
};

export interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  keyPoints: string[];
  recommended_practice: string[];
  detailedScores: {
    clarity: number;
    relevance: number;
    structure: number;
    confidence: number;
  };
};

export interface PracticeConfig {
  mode: 'quick' | 'comprehensive' | 'custom';
  jobTitle: string;
  company: string;
  industry?: string;
  focusAreas?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount?: number;
};