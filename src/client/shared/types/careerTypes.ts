export interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  demand: number;
  estimatedLearningTime: string;
  courses: Course[];
  relatedJobs: string[];
};

export interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  price: string;
  url: string;
  skills: string[];
};

export interface CareerGoal {
  id: string;
  title: string;
  targetRole: string;
  company: string;
  deadline: string;
  progress: number;
  milestones: Milestone[];
  requiredSkills: string[];
  status: 'active' | 'completed' | 'paused';
};

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  type: 'skill' | 'certification' | 'experience' | 'networking';
};

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: string;
  steps: LearningStep[];
  skills: string[];
  outcomes: string[];
};

export interface LearningStep {
  id: string;
  title: string;
  type: 'course' | 'project' | 'certification' | 'practice';
  duration: string;
  resources: Course[];
  completed: boolean;
};

export interface SalaryData {
  currentSalary: number;
  targetSalary: number;
  marketAverage: number;
  projectedGrowth: number;
  industryBenchmark: number;
  location: string;
};

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: 'learning' | 'career' | 'networking' | 'skill';
  points: number;
};

export interface NetworkingContact {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  connectionStrength: 'weak' | 'medium' | 'strong';
  lastContact: string;
  potentialValue: string;
  profileUrl?: string;
};

export interface IndustryTrend {
  id: string;
  skill: string;
  trend: 'rising' | 'stable' | 'declining';
  demandGrowth: number;
  averageSalary: number;
  jobPostings: number;
  description: string;
};

export interface CareerAssessment {
  id: string;
  title: string;
  questions: AssessmentQuestion[];
  completed: boolean;
  score?: number;
  recommendations?: string[];
};

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'rating' | 'text';
  options?: string[];
  answer?: string | number;
};

export interface NetworkingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'conference' | 'meetup' | 'workshop' | 'webinar' | 'networking';
  isVirtual: boolean;
  attendees: number;
  tags: string[];
  price: string;
  organizer: string;
  registrationUrl?: string;
  relevanceScore: number;
};

export interface NetworkingOpportunity {
  id: string;
  title: string;
  description: string;
  type: 'job_referral' | 'mentorship' | 'collaboration' | 'speaking' | 'interview_prep';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: string;
  benefits: string[];
  requirements: string[];
  contact?: string;
  deadline?: string;
}