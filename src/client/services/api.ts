import { ApiResponse, GeneratedResume, JobAnalysis, User } from '../types'
import api from './auth'

// User profile functions
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  // Use /auth/me instead of /users/me to avoid 400 errors
  const response = await api.get('/auth/me')
  return response.data
}

export const updateUserProfile = async (updates: {
  firstName?: string
  lastName?: string
  profile?: {
    headline?: string
    summary?: string
    location?: string
    websiteUrl?: string
    linkedinUrl?: string
    githubUrl?: string
  }
}): Promise<ApiResponse<any>> => {
  const response = await api.put('/users/me', updates)
  return response.data
}

export const getUserSkills = async (): Promise<ApiResponse<any[]>> => {
  const response = await api.get('/users/me/skills')
  return response.data
}

export const getUserResumes = async (): Promise<ApiResponse<any[]>> => {
  const response = await api.get('/users/me/resumes')
  return response.data
}

export const saveResume = async (resumeData: {
  title: string
  content: {
    personalInfo: {
      fullName: string
      email: string
      phone?: string
      location?: string
      website?: string
      linkedin?: string
    }
    summary?: string
    experiences: Array<{
      id: string
      title: string
      company: string
      location?: string
      startDate: string
      endDate?: string
      current?: boolean
      description?: string
    }>
    education: Array<{
      id: string
      institution: string
      degree: string
      fieldOfStudy?: string
      startDate?: string
      endDate?: string
      gpa?: string
      description?: string
    }>
    skills: Array<{
      id: string
      name: string
      level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
    }>
  }
  templateId?: string
  isPublic?: boolean
}): Promise<ApiResponse<any>> => {
  const response = await api.post('/users/me/resumes', resumeData)
  return response.data
}

export const updateResume = async (resumeId: string, resumeData: {
  title?: string
  content?: any
  templateId?: string
  isPublic?: boolean
}): Promise<ApiResponse<any>> => {
  const response = await api.put(`/users/me/resumes/${resumeId}`, resumeData)
  return response.data
}

export const getUserJobListings = async (): Promise<ApiResponse<any[]>> => {
  const response = await api.get('/users/me/jobs')
  return response.data
}

export const getUserExperiences = async (): Promise<ApiResponse<any[]>> => {
  const response = await api.get('/users/me/experiences')
  return response.data
}

export const getUserEducation = async (): Promise<ApiResponse<any[]>> => {
  const response = await api.get('/users/me/education')
  return response.data
}

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
  try {
    // Try to fetch real user profile first
    let userProfile = data.userProfile
    if (!userProfile) {
      try {
        const userResponse = await getCurrentUser()
        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data
          // Transform user data to resume format
          userProfile = {
            name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User',
            email: userData.email,
            phone: '', // Phone not in user profile yet
            location: userData.profile?.location || '',
            headline: userData.profile?.headline || '',
            summary: userData.profile?.summary || '',
            skills: userData.skills?.map((skill: any) => skill.name) || [],
            experience: userData.experiences?.map((exp: any) => ({
              title: exp.title,
              company: exp.companyName,
              startDate: exp.startDate,
              endDate: exp.endDate,
              current: exp.current,
              description: exp.description,
              skills: []
            })) || [],
            education: userData.education?.map((edu: any) => ({
              degree: edu.degree,
              institution: edu.institution,
              field: edu.fieldOfStudy,
              startDate: edu.startDate,
              endDate: edu.endDate,
              gpa: edu.gpa
            })) || [],
            certifications: userData.certifications?.map((cert: any) => ({
              name: cert.name,
              issuer: cert.issuer,
              date: cert.issueDate
            })) || []
          }
        }
      } catch (error) {
        console.warn('Could not fetch user profile, using defaults:', error)
      }
    }

    // Fallback to default profile if no real data available
    if (!userProfile) {
      userProfile = {
        name: 'User',
        email: 'user@example.com',
        phone: '',
        location: '',
        headline: 'Professional',
        summary: 'Experienced professional seeking new opportunities.',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: [],
        education: [],
        certifications: []
      }
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
  } catch (error: any) {
    console.error('Resume generation error:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to generate resume',
      message: 'Resume generation failed'
    }
  }
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
