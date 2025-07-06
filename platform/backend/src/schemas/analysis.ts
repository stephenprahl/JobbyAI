import { z } from 'zod';

// Schema for job listing data
export const jobListingSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  description: z.string().min(10, 'Job description is required'),
  requirements: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  url: z.string().url('Valid URL is required'),
  source: z.enum(['LINKEDIN', 'INDEED', 'GLASSDOOR', 'OTHER']).optional(),
  postedDate: z.string().optional(),
  salary: z.string().optional(),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'OTHER']).optional(),
});

// Schema for user profile data
export const userProfileSchema = z.object({
  skills: z.array(z.object({
    name: z.string(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
    yearsOfExperience: z.number().min(0).optional(),
  })),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().or(z.literal('Present')),
    description: z.string().optional(),
    skills: z.array(z.string()).optional(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    fieldOfStudy: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().or(z.literal('Present')).optional(),
  })),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    issueDate: z.string(),
    expirationDate: z.string().optional(),
  })).optional(),
});

// Schema for the analysis request
export const jobAnalysisSchema = z.object({
  job: jobListingSchema,
  userProfile: userProfileSchema.optional(),
  options: z.object({
    includeMissingSkills: z.boolean().default(true),
    includeSuggestions: z.boolean().default(true),
    detailedAnalysis: z.boolean().default(false),
  }).optional(),
});

// Schema for the analysis response
export const analysisResultSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchingSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  suggestions: z.array(z.string()),
  scoreBreakdown: z.object({
    skills: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
  }).optional(),
  detailedAnalysis: z.string().optional(),
  timestamp: z.string().datetime(),
});

// Type exports
export type JobListing = z.infer<typeof jobListingSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type JobAnalysisRequest = z.infer<typeof jobAnalysisSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
