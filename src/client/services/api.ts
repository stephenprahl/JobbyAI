import { ApiResponse, GeneratedResume, JobAnalysis } from '../types'
import api from './auth'

// Resume generation
export const generateResume = async (data: {
  jobTitle: string
  companyName: string
  jobDescription: string
  requirements?: string
  format?: string
  includeSummary?: boolean
  includeSkills?: boolean
  includeExperience?: boolean
  includeEducation?: boolean
  includeCertifications?: boolean
  maxLength?: number
}): Promise<ApiResponse<GeneratedResume>> => {
  // Create mock user profile - in a real app, this would come from the user's actual profile
  const mockUserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    headline: 'Senior Software Engineer',
    summary: 'Experienced software engineer with 5+ years of full-stack development experience.',
    skills: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'Python', 'AWS', 'Docker'],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        startDate: '2022-01-01',
        endDate: null,
        current: true,
        description: 'Lead development of React-based web applications serving 100k+ users.',
        skills: ['React', 'TypeScript', 'Node.js']
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        startDate: '2020-06-01',
        endDate: '2021-12-31',
        current: false,
        description: 'Developed full-stack web applications using React and Node.js.',
        skills: ['React', 'Node.js', 'MongoDB']
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Technology',
        field: 'Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-05-31',
        gpa: 3.8
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023-01-15'
      }
    ]
  }

  const jobListing = {
    title: data.jobTitle,
    company: data.companyName,
    description: data.jobDescription,
    requirements: data.requirements ? data.requirements.split('\n').filter(r => r.trim()) : []
  }

  const options = {
    format: data.format || 'markdown',
    includeSummary: data.includeSummary !== false,
    includeSkills: data.includeSkills !== false,
    includeExperience: data.includeExperience !== false,
    includeEducation: data.includeEducation !== false,
    includeCertifications: data.includeCertifications !== false,
    maxLength: data.maxLength || 1000
  }

  const response = await api.post('/resume/generate', {
    userProfile: mockUserProfile,
    jobListing,
    options
  })
  return response.data
}

// Get available resume formats
export const getResumeFormats = async (): Promise<ApiResponse<any>> => {
  const response = await api.get('/resume/formats')
  return response.data
}

// Job analysis
export const analyzeJob = async (data: {
  jobTitle: string
  companyName: string
  jobDescription: string
  requirements?: string
}): Promise<ApiResponse<JobAnalysis>> => {
  // Create mock user profile for analysis
  const mockUserProfile = {
    skills: [
      { name: 'React', level: 'EXPERT', yearsOfExperience: 4 },
      { name: 'TypeScript', level: 'ADVANCED', yearsOfExperience: 3 },
      { name: 'Node.js', level: 'ADVANCED', yearsOfExperience: 3 },
      { name: 'JavaScript', level: 'EXPERT', yearsOfExperience: 5 },
      { name: 'Python', level: 'INTERMEDIATE', yearsOfExperience: 2 }
    ],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        startDate: '2022-01-01',
        endDate: 'Present',
        description: 'Lead development of React applications'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        institution: 'University of Technology',
        fieldOfStudy: 'Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-05-31'
      }
    ]
  }

  const jobListing = {
    title: data.jobTitle,
    company: data.companyName,
    description: data.jobDescription,
    requirements: data.requirements ? data.requirements.split('\n').filter(r => r.trim()) : [],
    url: ''
  }

  const response = await api.post('/analyze', {
    job: jobListing,
    userProfile: mockUserProfile
  })
  return response.data
}
