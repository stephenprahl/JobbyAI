export interface SalaryData {
  currentSalary?: number;
  targetSalary: number;
  position: string;
  location: string;
  experience: number;
  skills: string[];
  companySize: 'startup' | 'medium' | 'large' | 'enterprise';
  industry: string;
};

export interface MarketData {
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  averageSalary: number;
  location: string;
  sampleSize: number;
  lastUpdated: string;
};

export interface NegotiationTip {
  id: string;
  category: 'preparation' | 'strategy' | 'communication' | 'alternatives';
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  actionItems: string[];
};

export interface CompensationPackage {
  baseSalary: number;
  bonus: number;
  equity: number;
  benefits: {
    healthcare: number;
    retirement: number;
    vacation: number;
    other: number;
  };
  totalCompensation: number;
};

export interface NegotiationScript {
  scenario: string;
  opener: string;
  keyPoints: string[];
  responses: {
    objection: string;
    response: string;
  }[];
  closingStatement: string;
};