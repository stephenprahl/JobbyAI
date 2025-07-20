import { CodingChallenge } from "@/data/interviewData";

// InterviewHubPage Types
export interface InterviewSession {
  id: string;
  position: string;
  company: string;
  difficulty: 'entry' | 'mid' | 'senior' | 'executive';
  interviewType: 'behavioral' | 'technical' | 'case' | 'presentation' | 'mixed';
  duration: number;
  createdAt: string;
  score?: number;
  questionsCompleted?: number;
  totalQuestions?: number;
  status: 'completed' | 'incomplete' | 'in_progress';
  feedback?: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    detailedScores: {
      communication: number;
      technical: number;
      behavioral: number;
      confidence: number;
    };
  };
  videoRecording?: {
    url: string;
    duration: number;
    size: number;
  };
  codeSubmissions?: Array<{
    questionId: string;
    code: string;
    language: string;
    testsPassed: number;
    totalTests: number;
  }>;
  questions?: Question[];
  industry?: string;
  focusAreas?: string[];
  codingChallenges?: CodingChallenge[];
};

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  tips: string[];
  idealAnswerStructure: string[];
};

export interface InterviewQuestion {
  id: string;
  type: 'behavioral' | 'technical' | 'situational' | 'company_specific';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  category: string;
  sampleAnswer?: string;
  followUpQuestions?: string[];
  keywords?: string[];
  industry?: string;
};

export interface InterviewPrepFeedback {
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

export interface InterviewResults {
  sessionId: string;
  overallScore: number;
  responses: Array<{
    questionId: string;
    response: string;
    duration: number;
    confidence: number;
    clarity: number;
    relevence: number;
    feedback: string;
    improvements: string[];
  }>;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  nextSteps: string[];
  detailedAnalysis?: {
    communicationScore: number;
    technicalScore: number;
    behavioralScore: number;
    confidenceLevel: number;
  };
};

export interface FilterOptions {
  type: string;
  difficulty: string;
  company: string;
  dateRange: string;
  status: string;
};

export interface PracticeConfig {
  mode: 'quick' | 'comprehensive' | 'custom';
  jobTitle: string;
  company: string;
  industry?: string;
  focusAreas?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  questionCount?: number;
};

export interface SimulatorState {
  isActive: boolean;
  currentQuestionIndex: number;
  timeRemaining: number;
  isRecording: boolean;
  isPaused: boolean;
  responses: string[];
  confidence: number[];
  startTime: Date | null;
};