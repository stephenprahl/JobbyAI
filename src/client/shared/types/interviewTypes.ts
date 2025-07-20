import { CodingChallenge } from "@/data/interviewData";

// InterviewHistoryPage
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
};

export interface FilterOptions {
  type: string;
  difficulty: string;
  company: string;
  dateRange: string;
  status: string;
};

