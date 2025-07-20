import { CodingChallenge } from "@/data/interviewData";

// InterviewSimulatorPage Types
export interface InterviewSession {
  id: string;
  position: string;
  company: string;
  difficulty: 'entry' | 'mid' | 'senior' | 'executive';
  interviewType: 'behavioral' | 'technical' | 'case' | 'presentation' | 'mixed';
  duration: number;
  questions: Question[];
  createdAt: string;
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

export interface InterviewResults {
  sessionId: string;
  overallScore: number;
  responses: Array<{
    questionId: string;
    response: string;
    duration: number;
    confidence: number;
    clarity: number;
    relevance: number;
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