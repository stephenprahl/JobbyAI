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
  userProfile?: any // Accept user profile data
}): Promise<ApiResponse<GeneratedResume>> => {
  // Use provided user profile or create a default one
  const userProfile = data.userProfile || {
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
    userProfile: userProfile,
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
  jobUrl?: string
  jobDescription?: string
  jobTitle: string
  company: string
  location?: string
  requirements?: string[]
}): Promise<ApiResponse<JobAnalysis>> => {
  try {
    // Create the analysis request payload
    const analysisPayload = {
      job: {
        title: data.jobTitle,
        company: data.company,
        description: data.jobDescription || '',
        requirements: data.requirements || [],
        location: data.location || '',
        salary: '',
        skills: [],
        experience: 0,
        education: '',
        employmentType: 'Full-time',
      },
      userProfile: {
        skills: [
          { name: 'React', level: 'Advanced' },
          { name: 'TypeScript', level: 'Advanced' },
          { name: 'Node.js', level: 'Intermediate' },
          { name: 'JavaScript', level: 'Advanced' },
          { name: 'Python', level: 'Intermediate' },
          { name: 'AWS', level: 'Beginner' },
          { name: 'Docker', level: 'Intermediate' }
        ],
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            startDate: '2022-01-01',
            endDate: '',
            description: 'Lead development of React-based web applications.',
            skills: ['React', 'TypeScript', 'Node.js']
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of Technology',
            field: 'Computer Science',
            startDate: '2016-09-01',
            endDate: '2020-05-31'
          }
        ]
      },
      options: {
        includeMissingSkills: true,
        includeSuggestions: true,
        detailedAnalysis: true
      }
    }

    const response = await api.post('/analyze/job', analysisPayload)

    if (response.data.success) {
      // Map backend response to frontend interface
      const backendData = response.data.data
      const mappedData: JobAnalysis = {
        matchScore: backendData.matchScore || 0,
        matchingSkills: backendData.matchingSkills || [],
        missingSkills: backendData.missingSkills || [],
        recommendations: backendData.suggestions || [], // Map suggestions to recommendations
        salaryRange: {
          min: 80000,
          max: 120000,
          currency: 'USD'
        },
        jobDetails: {
          title: data.jobTitle,
          company: data.company,
          location: data.location || 'Remote',
          type: 'Full-time',
          experience: 'Mid-level',
          description: data.jobDescription || '',
          requirements: data.requirements || []
        }
      }

      return {
        success: true,
        data: mappedData,
        message: 'Job analysis completed successfully'
      }
    } else {
      throw new Error(response.data.message || 'Analysis failed')
    }
  } catch (error: any) {
    console.error('Job analysis error:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to analyze job',
      message: 'Analysis failed'
    }
  }
}
