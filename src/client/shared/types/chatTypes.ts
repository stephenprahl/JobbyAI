export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  jobApplications?: JobApplication[];
  resumeData?: ResumeData;
};

export interface Attachment {
  id: string;
  name: string;
  type: 'resume' | 'job' | 'document';
  url?: string;
  data?: any;
};

export interface JobApplication {
  id: string;
  title: string;
  company: string;
  platform: string;
  url: string;
  status: 'pending' | 'applying' | 'applied' | 'failed';
  appliedAt?: Date;
  resumeUsed?: string;
};

export interface ResumeData {
  id: string;
  title: string;
  content: any;
  createdAt: Date;
  matchScore?: number;
};

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

export interface SuggestedPrompt {
  id: string;
  text: string;
  icon: React.ComponentType<any>;
  category: 'resume' | 'job' | 'career' | 'interview';
};