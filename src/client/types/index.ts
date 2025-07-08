export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  isActive: boolean
  emailVerified: boolean
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  userId: string
  headline?: string
  summary?: string
  location?: string
  websiteUrl?: string
  linkedinUrl?: string
  githubUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Experience {
  id: string
  userId: string
  title: string
  companyName: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Education {
  id: string
  userId: string
  institution: string
  degree: string
  fieldOfStudy?: string
  startDate?: string
  endDate?: string
  gpa?: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Certification {
  id: string
  userId: string
  name: string
  issuingOrganization: string
  issueDate: string
  expirationDate?: string
  credentialId?: string
  credentialUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: string
  name: string
  createdAt: string
}

export interface UserSkill {
  userId: string
  skillId: string
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  yearsOfExperience?: number
  createdAt: string
  updatedAt: string
  skill: Skill
}

export interface JobListing {
  id: string
  userId: string
  title: string
  companyName: string
  location?: string
  description?: string
  requirements: string[]
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERNSHIP' | 'VOLUNTEER'
  source?: string
  url?: string
  applied: boolean
  applicationDate?: string
  status?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ResumeTemplate {
  id: string
  name: string
  description?: string
  templateHtml: string
  templateCss?: string
  isPublic: boolean
  createdById?: string
  createdAt: string
  updatedAt: string
}

export interface UserResume {
  id: string
  userId: string
  templateId?: string
  title: string
  content: Record<string, any>
  isPublic: boolean
  createdAt: string
  updatedAt: string
  template?: ResumeTemplate
}

export interface JobAnalysis {
  matchScore: number
  matchingSkills: string[]
  missingSkills: string[]
  suggestions: string[]
  analysis: string
}

export interface GeneratedResume {
  content: string
  format: string
  metadata: {
    jobTitle: string
    company: string
    generatedAt: string
    options: ResumeOptions
  }
}

export interface ResumeOptions {
  format?: 'markdown' | 'html' | 'text' | 'pdf'
  includeSummary?: boolean
  includeSkills?: boolean
  includeExperience?: boolean
  includeEducation?: boolean
  includeCertifications?: boolean
  maxLength?: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}
