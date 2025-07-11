import React, { useEffect, useState } from 'react'
import { FiDownload, FiEdit3, FiEye, FiPlus, FiSave, FiStar, FiTrash2 } from 'react-icons/fi'
import { useQuery } from 'react-query'
import NavigationTailwind from '../components/NavigationTailwind'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../contexts/AuthContext'
import { generateResume, getCurrentUser, getUserResumes } from '../services/api'

interface ResumeSection {
  id: string
  type: 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'custom'
  title: string
  content: any
  order: number
}

interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  gpa?: number
  description?: string
}

const ResumeBuilderPageTailwind: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()
  const [resumeTitle, setResumeTitle] = useState('My Resume')
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [sections, setSections] = useState<ResumeSection[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)

  // Always call useQuery hooks - control with enabled option but don't conditionally call
  const { data: userProfile, isLoading: profileLoading } = useQuery(
    ['user-profile-builder'],
    () => getCurrentUser(),
    {
      enabled: !!user && !authLoading,
      retry: false,
      onError: (error) => {
        console.error('Error fetching user profile:', error)
      }
    }
  )

  const { data: userResumes, isLoading: resumesLoading } = useQuery(
    ['user-resumes'],
    () => getUserResumes(),
    {
      enabled: !!user && !authLoading,
      retry: false,
      onError: (error) => {
        console.error('Error fetching resumes:', error)
      }
    }
  )

  useEffect(() => {
    if (userProfile?.data) {
      const userData = userProfile.data
      setSections([
        {
          id: '1',
          type: 'personal',
          title: 'Personal Information',
          content: {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: '',
            location: userData.profile?.location || '',
            website: userData.profile?.websiteUrl || '',
            linkedin: userData.profile?.linkedinUrl || '',
            github: userData.profile?.githubUrl || '',
          },
          order: 1,
        },
        {
          id: '2',
          type: 'experience',
          title: 'Work Experience',
          content: userData.experiences || [],
          order: 2,
        },
        {
          id: '3',
          type: 'education',
          title: 'Education',
          content: userData.education || [],
          order: 3,
        },
        {
          id: '4',
          type: 'skills',
          title: 'Skills',
          content: userData.skills?.map((skill: any) => skill.name) || [],
          order: 4,
        },
      ])
    }
  }, [userProfile])

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const resumes = userResumes?.data || []

  const addExperience = () => {
    const experienceSection = sections.find(s => s.type === 'experience')
    if (experienceSection) {
      const newExperience: Experience = {
        id: Date.now().toString(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      }

      setSections(prev =>
        prev.map(section =>
          section.id === experienceSection.id
            ? { ...section, content: [...section.content, newExperience] }
            : section
        )
      )
    }
  }

  const updateExperience = (expId: string, field: keyof Experience, value: any) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'experience'
          ? {
            ...section,
            content: section.content.map((exp: Experience) =>
              exp.id === expId ? { ...exp, [field]: value } : exp
            ),
          }
          : section
      )
    )
  }

  const removeExperience = (expId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'experience'
          ? {
            ...section,
            content: section.content.filter((exp: Experience) => exp.id !== expId),
          }
          : section
      )
    )
  }

  const addEducation = () => {
    const educationSection = sections.find(s => s.type === 'education')
    if (educationSection) {
      const newEducation: Education = {
        id: Date.now().toString(),
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
      }

      setSections(prev =>
        prev.map(section =>
          section.id === educationSection.id
            ? { ...section, content: [...section.content, newEducation] }
            : section
        )
      )
    }
  }

  const updateEducation = (eduId: string, field: keyof Education, value: any) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'education'
          ? {
            ...section,
            content: section.content.map((edu: Education) =>
              edu.id === eduId ? { ...edu, [field]: value } : edu
            ),
          }
          : section
      )
    )
  }

  const removeEducation = (eduId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'education'
          ? {
            ...section,
            content: section.content.filter((edu: Education) => edu.id !== eduId),
          }
          : section
      )
    )
  }

  const addSkill = () => {
    const skillsSection = sections.find(s => s.type === 'skills')
    if (skillsSection) {
      setSections(prev =>
        prev.map(section =>
          section.id === skillsSection.id
            ? { ...section, content: [...section.content, ''] }
            : section
        )
      )
    }
  }

  const updateSkill = (index: number, value: string) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'skills'
          ? {
            ...section,
            content: section.content.map((skill: string, i: number) =>
              i === index ? value : skill
            ),
          }
          : section
      )
    )
  }

  const removeSkill = (index: number) => {
    setSections(prev =>
      prev.map(section =>
        section.type === 'skills'
          ? {
            ...section,
            content: section.content.filter((_: string, i: number) => i !== index),
          }
          : section
      )
    )
  }

  const saveResume = async () => {
    try {
      // TODO: Implement save resume API call
      console.log('Resume saved!')
    } catch (error) {
      console.error('Error saving resume:', error)
    }
  }

  const generateWithAI = async () => {
    setIsGenerating(true)
    try {
      // Build user profile from current sections or use real user data
      const userData = userProfile?.data
      let profileData

      if (userData) {
        // Use real user data
        profileData = {
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          email: userData.email || '',
          phone: '', // Add phone to profile later
          location: userData.profile?.location || '',
          headline: userData.profile?.headline || '',
          summary: userData.profile?.summary || '',
          skills: userData.skills?.map((skill: any) => skill.name) || [],
          experience: userData.experiences?.map((exp: any) => ({
            title: exp.title,
            company: exp.companyName,
            startDate: exp.startDate,
            endDate: exp.current ? undefined : exp.endDate,
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
          certifications: userData.certifications || []
        }
      } else {
        // Fallback to form data
        const personalInfo = sections.find(s => s.type === 'personal')?.content || {}
        const experience = sections.find(s => s.type === 'experience')?.content || []
        const education = sections.find(s => s.type === 'education')?.content || []
        const skills = sections.find(s => s.type === 'skills')?.content || []

        profileData = {
          name: `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim(),
          email: personalInfo.email || '',
          phone: personalInfo.phone || '',
          location: personalInfo.location || '',
          headline: personalInfo.headline || '',
          summary: personalInfo.summary || '',
          skills,
          experience: experience.map((exp: Experience) => ({
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.current ? undefined : exp.endDate,
            current: exp.current,
            description: exp.description,
            skills: []
          })),
          education: education.map((edu: Education) => ({
            degree: edu.degree,
            institution: edu.institution,
            field: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate,
            gpa: edu.gpa
          })),
          certifications: []
        }
      }

      // Use a more professional job listing template
      const result = await generateResume({
        jobTitle: 'Professional Position',
        companyName: 'Target Company',
        jobDescription: 'Professional opportunity matching your skills and experience.',
        userProfile: profileData,
        format: 'markdown',
        includeSummary: true,
        includeSkills: true,
        includeExperience: true,
        includeEducation: true,
        includeCertifications: true
      })

      if (result.success && result.data) {
        // Store the generated content
        setGeneratedContent(result.data.content || 'Resume generated successfully!')
        setResumeTitle(`Professional Resume - ${new Date().toLocaleDateString()}`)
        setIsAIModalOpen(true)
        console.log('Generated resume:', result.data)
      } else {
        throw new Error(result.error || 'Failed to generate resume')
      }
    } catch (error: any) {
      console.error('Generation failed:', error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const PersonalInfoSection = () => {
    const personalSection = sections.find(s => s.type === 'personal')
    if (!personalSection) return null

    return (
      <div className="card-professional animate-fade-in">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-heading mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={personalSection.content.firstName}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, firstName: e.target.value } }
                      : section
                  )
                )
              }
              className="input-professional"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={personalSection.content.lastName}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, lastName: e.target.value } }
                      : section
                  )
                )
              }
              className="input-professional"
            />
            <input
              type="email"
              placeholder="Email"
              value={personalSection.content.email}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, email: e.target.value } }
                      : section
                  )
                )
              }
              className="input-professional"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={personalSection.content.phone}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, phone: e.target.value } }
                      : section
                  )
                )
              }
              className="input-professional"
            />
            <input
              type="text"
              placeholder="Location"
              value={personalSection.content.location}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, location: e.target.value } }
                      : section
                  )
                )
              }
              className="input-professional"
            />
            <input
              type="url"
              placeholder="Website"
              value={personalSection.content.website}
              onChange={e =>
                setSections(prev =>
                  prev.map(section =>
                    section.type === 'personal'
                      ? { ...section, content: { ...section.content, website: e.target.value } }
                      : section
                  )
                )
              }
              className="input-professional"
            />
          </div>
        </div>
      </div>
    )
  }

  const ExperienceSection = () => {
    const experienceSection = sections.find(s => s.type === 'experience')
    if (!experienceSection) return null

    return (
      <div className="card-professional animate-fade-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-heading">Work Experience</h3>
            <button onClick={addExperience} className="btn-primary flex items-center gap-2">
              <FiPlus className="w-4 h-4" />
              Add Experience
            </button>
          </div>
          <div className="space-y-6">
            {experienceSection.content.map((exp: Experience) => (
              <div key={exp.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 bg-gray-50 dark:bg-dark-700/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-body">Experience Entry</span>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-error-500 hover:text-error-600 p-1 rounded transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={e => updateExperience(exp.id, 'title', e.target.value)}
                    className="input-professional"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                    className="input-professional"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={exp.location}
                    onChange={e => updateExperience(exp.id, 'location', e.target.value)}
                    className="input-professional"
                  />
                  <input
                    type="month"
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="input-professional"
                  />
                  {!exp.current && (
                    <input
                      type="month"
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                      className="input-professional"
                    />
                  )}
                </div>
                <textarea
                  placeholder="Job description and achievements..."
                  value={exp.description}
                  onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                  rows={4}
                  className="input-professional w-full resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const EducationSection = () => {
    const educationSection = sections.find(s => s.type === 'education')
    if (!educationSection) return null

    return (
      <div className="card-professional animate-fade-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-heading">Education</h3>
            <button onClick={addEducation} className="btn-primary flex items-center gap-2">
              <FiPlus className="w-4 h-4" />
              Add Education
            </button>
          </div>
          <div className="space-y-6">
            {educationSection.content.map((edu: Education) => (
              <div key={edu.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 bg-gray-50 dark:bg-dark-700/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium text-body">Education Entry</span>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="text-error-500 hover:text-error-600 p-1 rounded transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                    className="input-professional"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                    className="input-professional"
                  />
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={edu.fieldOfStudy}
                    onChange={e => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                    className="input-professional"
                  />
                  <input
                    type="number"
                    placeholder="GPA (optional)"
                    step="0.01"
                    min="0"
                    max="4"
                    value={edu.gpa || ''}
                    onChange={e => updateEducation(edu.id, 'gpa', parseFloat(e.target.value) || undefined)}
                    className="input-professional"
                  />
                  <input
                    type="month"
                    placeholder="Start Date"
                    value={edu.startDate}
                    onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                    className="input-professional"
                  />
                  <input
                    type="month"
                    placeholder="End Date"
                    value={edu.endDate}
                    onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                    className="input-professional"
                  />
                </div>
                <textarea
                  placeholder="Description (optional)"
                  value={edu.description || ''}
                  onChange={e => updateEducation(edu.id, 'description', e.target.value)}
                  rows={3}
                  className="input-professional w-full resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const SkillsSection = () => {
    const skillsSection = sections.find(s => s.type === 'skills')
    if (!skillsSection) return null

    // Skill suggestions based on common tech skills
    const skillSuggestions = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'Go',
      'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis', 'Git',
      'HTML/CSS', 'REST APIs', 'GraphQL', 'Testing', 'CI/CD', 'Agile', 'Scrum'
    ]

    const addSuggestedSkill = (skill: string) => {
      const skillsSection = sections.find(s => s.type === 'skills')
      if (skillsSection && !skillsSection.content.includes(skill)) {
        setSections(prev =>
          prev.map(section =>
            section.id === skillsSection.id
              ? { ...section, content: [...section.content, skill] }
              : section
          )
        )
      }
    }

    return (
      <div className="card-professional animate-fade-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-heading">Skills</h3>
            <button onClick={addSkill} className="btn-primary flex items-center gap-2">
              <FiPlus className="w-4 h-4" />
              Add Skill
            </button>
          </div>
          <div className="space-y-3 mb-6">
            {skillsSection.content.map((skill: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Skill name"
                  value={skill}
                  onChange={e => updateSkill(index, e.target.value)}
                  className="input-professional flex-1"
                />
                <button
                  onClick={() => removeSkill(index)}
                  className="text-error-500 hover:text-error-600 p-2 rounded transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-dark-600 pt-4">
            <p className="text-sm text-muted mb-3">Suggested Skills:</p>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions.map(skill => (
                <button
                  key={skill}
                  onClick={() => addSuggestedSkill(skill)}
                  className="px-3 py-1 text-sm bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
      <NavigationTailwind />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Existing Resumes Section */}
          {resumes.length > 0 && (
            <div className="card-professional animate-fade-in">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-heading mb-4">My Resumes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resumes.map((resume: any) => (
                    <div key={resume.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 bg-gray-50 dark:bg-dark-700/30 hover:bg-gray-100 dark:hover:bg-dark-700/50 transition-colors">
                      <div className="space-y-2">
                        <h3 className="font-medium text-heading">{resume.title}</h3>
                        <p className="text-sm text-muted">
                          Created: {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted">
                          Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button className="flex items-center gap-1 px-2 py-1 text-xs btn-secondary">
                            <FiEye className="w-3 h-3" />
                            View
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 text-xs btn-secondary">
                            <FiEdit3 className="w-3 h-3" />
                            Edit
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 text-xs btn-secondary">
                            <FiDownload className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-heading">Resume Builder</h1>
              <p className="text-body mt-1">Create and customize your professional resume</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ThemeToggle />
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <FiEye className="w-4 h-4" />
                Preview
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <FiDownload className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={generateWithAI}
                disabled={isGenerating}
                className="btn-accent flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiStar className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </button>
              <button onClick={saveResume} className="btn-primary flex items-center gap-2">
                <FiSave className="w-4 h-4" />
                Save Resume
              </button>
            </div>
          </div>

          {/* Resume Title */}
          <div className="card-professional animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <FiEdit3 className="w-5 h-5 text-muted" />
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={e => setResumeTitle(e.target.value)}
                  className="flex-1 text-lg font-semibold bg-transparent border-none outline-none text-heading focus:ring-0"
                  placeholder="Resume Title"
                />
              </div>
            </div>
          </div>

          {/* Resume Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <PersonalInfoSection />
              <ExperienceSection />
            </div>
            <div className="space-y-6">
              <EducationSection />
              <SkillsSection />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl max-w-4xl max-h-[90vh] overflow-hidden shadow-strong animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-600">
              <h2 className="text-xl font-semibold text-heading">Resume Preview</h2>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-muted hover:text-body transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {sections.map(section => (
                  <div key={section.id} className="p-4 border border-gray-200 dark:border-dark-600 rounded-lg">
                    <h3 className="text-lg font-semibold text-heading mb-3">{section.title}</h3>
                    {section.type === 'personal' && (
                      <div className="text-body">
                        <p className="font-medium">
                          {section.content.firstName} {section.content.lastName}
                        </p>
                        <p>{section.content.email} | {section.content.phone}</p>
                        <p>{section.content.location} | {section.content.website}</p>
                      </div>
                    )}
                    {section.type === 'experience' && (
                      <div className="space-y-3">
                        {section.content.map((exp: Experience) => (
                          <div key={exp.id} className="p-3 border border-gray-100 dark:border-dark-700 rounded">
                            <p className="font-medium text-heading">{exp.title} - {exp.company}</p>
                            <p className="text-sm text-muted">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                            <p className="text-body mt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {section.type === 'education' && (
                      <div className="space-y-3">
                        {section.content.map((edu: Education) => (
                          <div key={edu.id} className="p-3 border border-gray-100 dark:border-dark-700 rounded">
                            <p className="font-medium text-heading">{edu.degree} in {edu.fieldOfStudy}</p>
                            <p className="text-sm text-muted">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                            {edu.gpa && <p className="text-sm text-muted">GPA: {edu.gpa}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    {section.type === 'skills' && (
                      <div className="flex flex-wrap gap-2">
                        {section.content.map((skill: string, index: number) => (
                          <span key={index} className="px-3 py-1 text-sm bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generated Resume Preview Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl max-w-6xl max-h-[90vh] overflow-hidden shadow-strong animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-600">
              <h2 className="text-xl font-semibold text-heading">AI Generated Resume Preview</h2>
              <button
                onClick={() => setIsAIModalOpen(false)}
                className="text-muted hover:text-body transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="p-6 border border-gray-200 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700/30 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm text-body">
                  {generatedContent}
                </pre>
              </div>
              <div className="flex gap-4 mt-6 justify-end">
                <button
                  onClick={() => setIsAIModalOpen(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeBuilderPageTailwind
