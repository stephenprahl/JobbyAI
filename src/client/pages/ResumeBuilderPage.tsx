import React, { useEffect, useState } from 'react'
import { FiCalendar, FiCheckCircle, FiDownload, FiEdit3, FiEye, FiFileText, FiMapPin, FiPlus, FiSave, FiStar, FiTrash2, FiUser, FiX, FiZap } from 'react-icons/fi'
import { getTemplateById } from '../components/templates/ResumeTemplates'
import TemplatePicker from '../components/templates/TemplatePicker'
import TemplatePreviewModal from '../components/templates/TemplatePreviewModal'
import { useAuth } from '../contexts/AuthContext'
import { saveResume } from '../services/api'

// Types for Resume Data
interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
}

interface WorkExperience {
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
  gpa?: string
  description?: string
}

interface Skill {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

interface ResumeData {
  title: string
  personalInfo: PersonalInfo
  summary: string
  experiences: WorkExperience[]
  education: Education[]
  skills: Skill[]
}

const ResumeBuilderPageTailwind: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()

  // State management
  const [resumeData, setResumeData] = useState<ResumeData>({
    title: 'My Professional Resume',
    personalInfo: {
      fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
      email: user?.email || '',
      phone: '',
      location: '',
      website: '',
      linkedin: ''
    },
    summary: '',
    experiences: [],
    education: [],
    skills: []
  })

  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [showEducationForm, setShowEducationForm] = useState(false)
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('classic-professional')
  const [isExporting, setIsExporting] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [resumeVersions, setResumeVersions] = useState<Array<{ id: string, name: string, data: ResumeData, timestamp: Date }>>([])
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [targetJobTitle, setTargetJobTitle] = useState('')
  const [targetCompany, setTargetCompany] = useState('')
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null)

  // Template Functions
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setShowTemplateSelector(false)
  }

  const handleTemplatePreview = (templateId: string) => {
    setPreviewTemplateId(templateId)
  }

  const getSelectedTemplateName = () => {
    const template = getTemplateById(selectedTemplate)
    return template?.name || 'Professional'
  }

  // Generate unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Update personal info
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  // Add/Edit Experience
  const addOrUpdateExperience = (experience: Omit<WorkExperience, 'id'>) => {
    if (editingExperience) {
      setResumeData(prev => ({
        ...prev,
        experiences: prev.experiences.map(exp =>
          exp.id === editingExperience.id
            ? { ...experience, id: editingExperience.id }
            : exp
        )
      }))
      setEditingExperience(null)
    } else {
      setResumeData(prev => ({
        ...prev,
        experiences: [...prev.experiences, { ...experience, id: generateId() }]
      }))
    }
    setShowExperienceForm(false)
  }

  // Remove Experience
  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }))
  }

  // Add/Edit Education
  const addOrUpdateEducation = (education: Omit<Education, 'id'>) => {
    if (editingEducation) {
      setResumeData(prev => ({
        ...prev,
        education: prev.education.map(edu =>
          edu.id === editingEducation.id
            ? { ...education, id: editingEducation.id }
            : edu
        )
      }))
      setEditingEducation(null)
    } else {
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, { ...education, id: generateId() }]
      }))
    }
    setShowEducationForm(false)
  }

  // Remove Education
  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  // Add Skill
  const addSkill = (skill: Omit<Skill, 'id'>) => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { ...skill, id: generateId() }]
    }))
    setShowSkillForm(false)
  }

  // Remove Skill
  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }))
  }

  // Save Resume
  const saveResumeHandler = async () => {
    setIsSaving(true)
    try {
      const resumePayload = {
        title: resumeData.title,
        content: {
          personalInfo: resumeData.personalInfo,
          summary: resumeData.summary,
          experiences: resumeData.experiences,
          education: resumeData.education,
          skills: resumeData.skills
        },
        templateId: selectedTemplate,
        isPublic: false
      }

      const response = await saveResume(resumePayload)

      if (response.success) {
        console.log('Resume saved successfully:', response.data)
        setLastSaved(new Date())
        // You could show a toast notification here
        alert('Resume saved successfully!')
      } else {
        throw new Error(response.error || 'Failed to save resume')
      }
    } catch (error) {
      console.error('Failed to save resume:', error)
      alert('Failed to save resume. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Export to PDF
  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      // Create a simple HTML version of the resume
      const htmlContent = generateHTMLResume()

      // Use the browser's print functionality to create PDF
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.print()
      }
    } catch (error) {
      console.error('Failed to export PDF:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Generate HTML version of resume for PDF export
  const generateHTMLResume = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${resumeData.title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .contact { font-size: 14px; color: #666; }
        .section { margin: 25px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
        .experience, .education { margin-bottom: 20px; }
        .job-title { font-weight: bold; color: #333; }
        .company { color: #666; font-style: italic; }
        .date { color: #888; font-size: 12px; }
        .description { margin-top: 8px; white-space: pre-line; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${resumeData.personalInfo.fullName}</div>
        <div class="contact">
          ${resumeData.personalInfo.email} • ${resumeData.personalInfo.phone} • ${resumeData.personalInfo.location}
          ${resumeData.personalInfo.website ? ` • ${resumeData.personalInfo.website}` : ''}
        </div>
      </div>

      ${resumeData.summary ? `
      <div class="section">
        <div class="section-title">Professional Summary</div>
        <div>${resumeData.summary}</div>
      </div>
      ` : ''}

      ${resumeData.experiences.length > 0 ? `
      <div class="section">
        <div class="section-title">Work Experience</div>
        ${resumeData.experiences.map(exp => `
          <div class="experience">
            <div class="job-title">${exp.title}</div>
            <div class="company">${exp.company} • ${exp.location}</div>
            <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
            <div class="description">${exp.description}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${resumeData.education.length > 0 ? `
      <div class="section">
        <div class="section-title">Education</div>
        ${resumeData.education.map(edu => `
          <div class="education">
            <div class="job-title">${edu.degree} in ${edu.fieldOfStudy}</div>
            <div class="company">${edu.institution}</div>
            <div class="date">${edu.startDate} - ${edu.endDate}</div>
            ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
            ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${resumeData.skills.length > 0 ? `
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills">
          ${resumeData.skills.map(skill => `<div class="skill">${skill.name} (${skill.level})</div>`).join('')}
        </div>
      </div>
      ` : ''}
    </body>
    </html>
    `
  }

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return

    const autoSaveTimer = setTimeout(() => {
      saveResumeHandler()
      setLastSaved(new Date())
    }, 30000) // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer)
  }, [resumeData, autoSaveEnabled])

  // Calculate resume completion percentage
  const calculateCompletionPercentage = () => {
    let completed = 0
    let total = 6

    if (resumeData.title.trim()) completed++
    if (resumeData.personalInfo.fullName.trim() && resumeData.personalInfo.email.trim()) completed++
    if (resumeData.summary.trim()) completed++
    if (resumeData.experiences.length > 0) completed++
    if (resumeData.education.length > 0) completed++
    if (resumeData.skills.length > 0) completed++

    return Math.round((completed / total) * 100)
  }

  // ATS Score calculation
  const calculateATSScore = () => {
    let score = 0
    let maxScore = 100

    // Basic info completeness (30 points)
    if (resumeData.personalInfo.fullName.trim()) score += 5
    if (resumeData.personalInfo.email.trim()) score += 5
    if (resumeData.personalInfo.phone.trim()) score += 5
    if (resumeData.personalInfo.location.trim()) score += 5
    if (resumeData.summary.trim()) score += 10

    // Experience section (25 points)
    if (resumeData.experiences.length > 0) {
      score += 15
      const hasQuantifiedAchievements = resumeData.experiences.some(exp =>
        exp.description.match(/\d+(%|\+|million|k|thousand)/i)
      )
      if (hasQuantifiedAchievements) score += 10
    }

    // Education (15 points)
    if (resumeData.education.length > 0) score += 15

    // Skills (20 points)
    if (resumeData.skills.length >= 5) score += 20
    else if (resumeData.skills.length > 0) score += 10

    // Format optimization (10 points)
    const hasGoodLength = resumeData.summary.length > 100 && resumeData.summary.length < 300
    if (hasGoodLength) score += 5

    const hasActionVerbs = resumeData.experiences.some(exp =>
      exp.description.match(/\b(led|managed|developed|created|implemented|improved|increased|reduced|achieved)\b/i)
    )
    if (hasActionVerbs) score += 5

    return Math.min(score, maxScore)
  }

  // AI Content Generation
  const generateAISuggestions = async (section: string, context: string) => {
    setIsGeneratingAI(true)
    try {
      // Simulate AI API call
      const suggestions = await simulateAISuggestions(section, context)
      setAiSuggestions(suggestions)
      setShowAIAssistant(true)
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  // Simulate AI suggestions (replace with real AI API)
  const simulateAISuggestions = async (section: string, context: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const suggestionSets = {
      summary: [
        'Results-driven professional with proven track record of delivering innovative solutions',
        'Experienced leader with expertise in driving cross-functional team collaboration',
        'Strategic thinker with strong analytical skills and attention to detail',
        'Passionate professional dedicated to continuous learning and growth'
      ],
      experience: [
        'Led cross-functional team of 8 developers to deliver project 3 weeks ahead of schedule',
        'Implemented automated testing framework, reducing bug reports by 65%',
        'Optimized database queries resulting in 40% improvement in application performance',
        'Mentored 5 junior developers, contributing to 90% team retention rate'
      ],
      skills: [
        'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'MongoDB',
        'Project Management', 'Team Leadership', 'Agile/Scrum', 'Data Analysis'
      ]
    }

    return suggestionSets[section as keyof typeof suggestionSets] || []
  }

  // Version Management
  const saveResumeVersion = (name: string) => {
    const newVersion = {
      id: generateId(),
      name,
      data: { ...resumeData },
      timestamp: new Date()
    }
    setResumeVersions(prev => [newVersion, ...prev].slice(0, 10)) // Keep last 10 versions
  }

  const loadResumeVersion = (versionId: string) => {
    const version = resumeVersions.find(v => v.id === versionId)
    if (version) {
      setResumeData(version.data)
      setShowVersionHistory(false)
    }
  }

  // Enhanced Export Functions
  const exportToWord = async () => {
    setIsExporting(true)
    try {
      // Create a comprehensive Word document content
      const wordContent = generateWordContent()
      const blob = new Blob([wordContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export to Word:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const generateWordContent = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        <w:p><w:r><w:t>${resumeData.personalInfo.fullName}</w:t></w:r></w:p>
        <w:p><w:r><w:t>${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}</w:t></w:r></w:p>
        <w:p><w:r><w:t>${resumeData.personalInfo.location}</w:t></w:r></w:p>
        ${resumeData.summary ? `<w:p><w:r><w:t>PROFESSIONAL SUMMARY</w:t></w:r></w:p><w:p><w:r><w:t>${resumeData.summary}</w:t></w:r></w:p>` : ''}
        ${resumeData.experiences.length > 0 ? `<w:p><w:r><w:t>WORK EXPERIENCE</w:t></w:r></w:p>` : ''}
        ${resumeData.experiences.map(exp => `
          <w:p><w:r><w:t>${exp.title} - ${exp.company}</w:t></w:r></w:p>
          <w:p><w:r><w:t>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</w:t></w:r></w:p>
          <w:p><w:r><w:t>${exp.description}</w:t></w:r></w:p>
        `).join('')}
      </w:body>
    </w:document>`
  }

  // Auto-suggestions based on target job
  const generateJobSpecificSuggestions = () => {
    if (!targetJobTitle) return []

    const jobSuggestions = {
      'software engineer': ['React', 'JavaScript', 'Python', 'Git', 'Agile'],
      'data scientist': ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Statistics'],
      'product manager': ['Product Strategy', 'Roadmap Planning', 'Stakeholder Management', 'Analytics'],
      'marketing manager': ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media']
    }

    const normalizedTitle = targetJobTitle.toLowerCase()
    for (const [job, skills] of Object.entries(jobSuggestions)) {
      if (normalizedTitle.includes(job)) {
        return skills
      }
    }
    return []
  }

  // Add sample data for testing
  const addSampleData = () => {
    setResumeData({
      title: 'Software Engineer Resume',
      personalInfo: {
        fullName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe'
      },
      summary: 'Experienced software engineer with 5+ years of experience building scalable web applications using React, Node.js, and cloud technologies. Passionate about creating efficient, user-friendly solutions and leading cross-functional teams.',
      experiences: [
        {
          id: generateId(),
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: '',
          current: true,
          description: '• Led development of microservices architecture serving 1M+ users\n• Improved application performance by 40% through code optimization\n• Mentored junior developers and conducted code reviews'
        },
        {
          id: generateId(),
          title: 'Software Engineer',
          company: 'StartupXYZ',
          location: 'Remote',
          startDate: '2020-06',
          endDate: '2021-12',
          current: false,
          description: '• Built responsive web applications using React and TypeScript\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Collaborated with designers to improve user experience'
        }
      ],
      education: [
        {
          id: generateId(),
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2016-09',
          endDate: '2020-05',
          gpa: '3.8/4.0',
          description: 'Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering'
        }
      ],
      skills: [
        { id: generateId(), name: 'React', level: 'Expert' },
        { id: generateId(), name: 'TypeScript', level: 'Advanced' },
        { id: generateId(), name: 'Node.js', level: 'Advanced' },
        { id: generateId(), name: 'Python', level: 'Intermediate' },
        { id: generateId(), name: 'AWS', level: 'Intermediate' },
        { id: generateId(), name: 'Docker', level: 'Advanced' }
      ]
    })
  }

  const completionPercentage = calculateCompletionPercentage()

  // Experience Form Component - Memoized to prevent re-creation
  const ExperienceForm = React.memo<{
    onSubmit: (exp: Omit<WorkExperience, 'id'>) => void
    onCancel: () => void
    initialData?: WorkExperience
  }>(({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
      title: initialData?.title || '',
      company: initialData?.company || '',
      location: initialData?.location || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      current: initialData?.current || false,
      description: initialData?.description || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(formData)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {initialData ? 'Edit Experience' : 'Add Work Experience'}
              </h3>
              <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="profile-label">Job Title*</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="profile-input"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="profile-label">Company*</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="profile-input"
                  placeholder="Tech Corp"
                />
              </div>
              <div>
                <label className="profile-label">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="profile-input"
                  placeholder="San Francisco, CA"
                />
              </div>
              <div>
                <label className="profile-label">Start Date*</label>
                <input
                  type="month"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="profile-input"
                />
              </div>
              <div>
                <label className="profile-label">End Date</label>
                <input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="profile-input"
                  disabled={formData.current}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : prev.endDate
                  }))}
                  className="mr-2"
                />
                <label htmlFor="current" className="text-sm text-gray-700 dark:text-gray-300">
                  Currently working here
                </label>
              </div>
            </div>

            <div>
              <label className="profile-label">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="profile-textarea"
                placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality products&#10;• Improved application performance by 30% through code optimization"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="btn btn-primary flex-1"
              >
                {initialData ? 'Update Experience' : 'Add Experience'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  })

  // Education Form Component - Memoized to prevent re-creation
  const EducationForm = React.memo<{
    onSubmit: (edu: Omit<Education, 'id'>) => void
    onCancel: () => void
    initialData?: Education
  }>(({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
      institution: initialData?.institution || '',
      degree: initialData?.degree || '',
      fieldOfStudy: initialData?.fieldOfStudy || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      gpa: initialData?.gpa || '',
      description: initialData?.description || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(formData)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {initialData ? 'Edit Education' : 'Add Education'}
              </h3>
              <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="profile-label">Institution*</label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  className="profile-input"
                  placeholder="University of California, Berkeley"
                />
              </div>
              <div>
                <label className="profile-label">Degree*</label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                  className="profile-input"
                  placeholder="Bachelor of Science"
                />
              </div>
              <div>
                <label className="profile-label">Field of Study*</label>
                <input
                  type="text"
                  required
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                  className="profile-input"
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <label className="profile-label">Start Date</label>
                <input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="profile-input"
                />
              </div>
              <div>
                <label className="profile-label">End Date</label>
                <input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="profile-input"
                />
              </div>
              <div>
                <label className="profile-label">GPA (Optional)</label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                  className="profile-input"
                  placeholder="3.8/4.0"
                />
              </div>
            </div>

            <div>
              <label className="profile-label">Additional Information</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="profile-textarea"
                placeholder="Relevant coursework, honors, achievements..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="btn btn-primary flex-1"
              >
                {initialData ? 'Update Education' : 'Add Education'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  })

  // Skill Form Component - Memoized to prevent re-creation
  const SkillForm = React.memo<{
    onSubmit: (skill: Omit<Skill, 'id'>) => void
    onCancel: () => void
  }>(({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      name: '',
      level: 'Intermediate' as Skill['level']
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (formData.name.trim()) {
        onSubmit(formData)
        setFormData({ name: '', level: 'Intermediate' })
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Skill</h3>
              <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div>
              <label className="profile-label">Skill Name*</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="profile-input"
                placeholder="React, Python, Project Management..."
              />
            </div>

            <div>
              <label className="profile-label">Proficiency Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as Skill['level'] }))}
                className="profile-input"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="btn btn-primary flex-1"
              >
                Add Skill
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  })

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Experience Form Modal */}
      {showExperienceForm && (
        <ExperienceForm
          onSubmit={addOrUpdateExperience}
          onCancel={() => {
            setShowExperienceForm(false)
            setEditingExperience(null)
          }}
          initialData={editingExperience || undefined}
        />
      )}

      {/* Education Form Modal */}
      {showEducationForm && (
        <EducationForm
          onSubmit={addOrUpdateEducation}
          onCancel={() => {
            setShowEducationForm(false)
            setEditingEducation(null)
          }}
          initialData={editingEducation || undefined}
        />
      )}

      {/* Skill Form Modal */}
      {showSkillForm && (
        <SkillForm
          onSubmit={addSkill}
          onCancel={() => setShowSkillForm(false)}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Resume Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Template Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selected Template
                  </label>
                  <button
                    onClick={() => setShowTemplateSelector(true)}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-semibold"
                  >
                    Change Template
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                      <FiFileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {getSelectedTemplateName()}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getTemplateById(selectedTemplate)?.description || 'Professional resume template'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Content - This will be dynamic based on selected template */}
              <div className="space-y-8">
                {/* Header */}
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {resumeData.personalInfo.fullName}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {resumeData.personalInfo.location} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.email}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <img
                        src="/path/to/profile-pic.jpg"
                        alt="Profile Picture"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Experience Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Work Experience
                  </h3>
                  {resumeData.experiences.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      No work experience added yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {resumeData.experiences.map((experience) => (
                        <div key={experience.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {experience.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {experience.company} • {experience.location}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(experience.startDate).toLocaleString('default', { month: 'short', year: 'numeric' })} - {experience.current ? 'Present' : new Date(experience.endDate).toLocaleString('default', { month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                            {experience.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Education Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Education
                  </h3>
                  {resumeData.education.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      No education added yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {edu.degree} in {edu.fieldOfStudy}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {edu.institution}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(edu.startDate).toLocaleString('default', { month: 'short', year: 'numeric' })} - {new Date(edu.endDate).toLocaleString('default', { month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                          {edu.gpa && (
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              GPA: {edu.gpa}
                            </div>
                          )}
                          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                            {edu.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Skills
                  </h3>
                  {resumeData.skills.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      No skills added yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {resumeData.skills.map(skill => {
                        const levelColors = {
                          'Beginner': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                          'Intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                          'Advanced': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                          'Expert': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }

                        const levelWidth = {
                          'Beginner': 'w-1/4',
                          'Intermediate': 'w-1/2',
                          'Advanced': 'w-3/4',
                          'Expert': 'w-full'
                        }

                        return (
                          <div key={skill.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-base font-bold text-gray-950 dark:text-white">{skill.name}</h3>
                              <button
                                onClick={() => removeSkill(skill.id)}
                                className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${levelColors[skill.level]}`}>
                                  {skill.level}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className={`bg-primary-500 h-2 rounded-full transition-all duration-300 ${levelWidth[skill.level]}`}></div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2 text-base py-3 px-6 font-bold"
                >
                  <FiDownload className="w-5 h-5" />
                  <span>Download Resume</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-500 to-primary-600 p-2 rounded-xl">
                    <FiZap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">AI Content Assistant</h3>
                </div>
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    💡 AI-generated suggestions based on industry best practices and your target role
                  </p>
                </div>

                {isGeneratingAI ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Generating AI suggestions...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-start justify-between">
                          <p className="text-gray-900 dark:text-white text-sm leading-relaxed flex-1">{suggestion}</p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(suggestion)
                              // You could add a toast notification here
                            }}
                            className="ml-3 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Copy to clipboard"
                          >
                            <FiFileText className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAIAssistant(false)}
                    className="btn btn-outline flex-1"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => generateAISuggestions('summary', resumeData.summary)}
                    disabled={isGeneratingAI}
                    className="btn btn-primary flex-1"
                  >
                    Generate More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Versions</h3>
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    const versionName = prompt('Enter a name for this version:')
                    if (versionName) {
                      saveResumeVersion(versionName)
                    }
                  }}
                  className="w-full btn btn-primary"
                >
                  Save Current Version
                </button>

                {resumeVersions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No saved versions yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resumeVersions.map((version) => (
                      <div key={version.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{version.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {version.timestamp.toLocaleDateString()} at {version.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => loadResumeVersion(version.id)}
                          className="btn btn-outline"
                        >
                          Load
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {/* Enhanced Header */}
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-primary-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                    <FiFileText className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight">
                    Resume Builder
                  </h1>
                </div>
                <p className="text-xl text-gray-700 dark:text-gray-200 font-medium max-w-2xl leading-relaxed">
                  Create a professional, ATS-friendly resume tailored to your target job with AI-powered assistance
                </p>
                <div className="flex items-center space-x-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
                  <FiZap className="w-4 h-4" />
                  <span>AI-Powered • ATS-Optimized • Professional Templates</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowPreview(true)}
                  className="btn btn-outline flex items-center justify-center space-x-2 text-base py-3 px-6 font-bold"
                >
                  <FiEye className="w-5 h-5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={saveResumeHandler}
                  disabled={isSaving}
                  className="btn btn-primary flex items-center justify-center space-x-2 text-base py-3 px-6 font-bold shadow-xl disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <FiSave className="w-5 h-5" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Resume'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Panel - Builder */}
            <div className="lg:col-span-2 space-y-8">
              {/* Resume Title */}
              <div className="card card-hover">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl">
                    <FiEdit3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Resume Title</h2>
                </div>
                <input
                  type="text"
                  value={resumeData.title}
                  onChange={(e) => setResumeData(prev => ({ ...prev, title: e.target.value }))}
                  className="profile-input text-lg"
                  placeholder="Give your resume a descriptive title..."
                />
              </div>

              {/* Personal Information */}
              <div className="card card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
                      <FiUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Personal Information</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="profile-label">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className="profile-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="profile-label">Email Address</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="profile-input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="profile-label">Phone Number</label>
                    <input
                      type="tel"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="profile-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="profile-label">Location</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      className="profile-input"
                      placeholder="City, State/Country"
                    />
                  </div>
                  <div>
                    <label className="profile-label">Website (Optional)</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.website}
                      onChange={(e) => updatePersonalInfo('website', e.target.value)}
                      className="profile-input"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="profile-label">LinkedIn (Optional)</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      className="profile-input"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="card card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">
                      <FiFileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Professional Summary</h2>
                  </div>
                </div>
                <textarea
                  rows={5}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career goals. Focus on what makes you unique and valuable to employers..."
                  className="profile-textarea text-base leading-relaxed"
                />
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    💡 Pro Tip: Keep it concise (3-4 sentences) and quantify your achievements when possible.
                  </p>
                </div>
              </div>

              {/* Experience Section */}
              <div className="card card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl">
                      <FiStar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Work Experience</h2>
                  </div>
                  <button className="btn btn-primary flex items-center space-x-2 py-3 px-5 font-bold" onClick={() => setShowExperienceForm(true)}>
                    <FiPlus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>
                {resumeData.experiences.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiStar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">No work experience added yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">Start building your professional story by adding your work experience</p>
                    <button className="btn btn-outline font-bold" onClick={() => setShowExperienceForm(true)}>Add Your First Experience</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumeData.experiences.map((experience) => (
                      <div key={experience.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{experience.title}</h3>
                              {experience.current && (
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold px-2 py-1 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-primary-600 dark:text-primary-400 font-semibold mb-1">{experience.company}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {experience.location && (
                                <div className="flex items-center space-x-1">
                                  <FiMapPin className="w-4 h-4" />
                                  <span>{experience.location}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <FiCalendar className="w-4 h-4" />
                                <span>
                                  {experience.startDate && new Date(experience.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
                                  {experience.current ? ' Present' : (experience.endDate ? ` ${new Date(experience.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : '')}
                                </span>
                              </div>
                            </div>
                            {experience.description && (
                              <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                {experience.description}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingExperience(experience)
                                setShowExperienceForm(true)
                              }}
                              className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeExperience(experience.id)}
                              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Education Section */}
              <div className="card card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-xl">
                      <FiStar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Education</h2>
                  </div>
                  <button className="btn btn-primary flex items-center space-x-2 py-3 px-5 font-bold" onClick={() => setShowEducationForm(true)}>
                    <FiPlus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>
                {resumeData.education.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiStar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">No education added yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">Add your educational background and qualifications</p>
                    <button className="btn btn-outline font-bold" onClick={() => setShowEducationForm(true)}>Add Your Education</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                              {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                            </h3>
                            <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">{edu.institution}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {(edu.startDate || edu.endDate) && (
                                <div className="flex items-center space-x-1">
                                  <FiCalendar className="w-4 h-4" />
                                  <span>
                                    {edu.startDate && new Date(edu.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    {edu.startDate && edu.endDate && ' - '}
                                    {edu.endDate && new Date(edu.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                              )}
                              {edu.gpa && (
                                <div className="flex items-center space-x-1">
                                  <FiStar className="w-4 h-4" />
                                  <span>GPA: {edu.gpa}</span>
                                </div>
                              )}
                            </div>
                            {edu.description && (
                              <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                {edu.description}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => {
                                setEditingEducation(edu)
                                setShowEducationForm(true)
                              }}
                              className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeEducation(edu.id)}
                              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div className="card card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl">
                      <FiZap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">Skills</h2>
                  </div>
                  <button className="btn btn-primary flex items-center space-x-2 py-3 px-5 font-bold" onClick={() => setShowSkillForm(true)}>
                    <FiPlus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>
                {resumeData.skills.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiZap className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">No skills added yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">Showcase your technical and soft skills</p>
                    <button className="btn btn-outline font-bold" onClick={() => setShowSkillForm(true)}>Add Your Skills</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resumeData.skills.map(skill => {
                      const levelColors = {
                        'Beginner': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                        'Intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
                        'Advanced': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                        'Expert': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }

                      const levelWidth = {
                        'Beginner': 'w-1/4',
                        'Intermediate': 'w-1/2',
                        'Advanced': 'w-3/4',
                        'Expert': 'w-full'
                      }

                      return (
                        <div key={skill.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-gray-950 dark:text-white">{skill.name}</h3>
                            <button
                              onClick={() => removeSkill(skill.id)}
                              className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${levelColors[skill.level]}`}>
                                {skill.level}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className={`bg-primary-500 h-2 rounded-full transition-all duration-300 ${levelWidth[skill.level]}`}></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Right Panel - AI Assistant & Actions */}
            <div className="space-y-8">
              {/* Resume Progress */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-gray-950 dark:text-white">Resume Progress</h3>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Title & Contact</span>
                    <span className={resumeData.title.trim() && resumeData.personalInfo.fullName.trim() ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                      {resumeData.title.trim() && resumeData.personalInfo.fullName.trim() ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Summary</span>
                    <span className={resumeData.summary.trim() ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                      {resumeData.summary.trim() ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Experience</span>
                    <span className={resumeData.experiences.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                      {resumeData.experiences.length > 0 ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Education</span>
                    <span className={resumeData.education.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                      {resumeData.education.length > 0 ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Skills</span>
                    <span className={resumeData.skills.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                      {resumeData.skills.length > 0 ? '✓' : '○'}
                    </span>
                  </div>
                </div>
                {completionPercentage < 100 && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                      Complete all sections to create a professional resume
                    </p>
                  </div>
                )}
                {completionPercentage === 100 && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                      🎉 Your resume is complete! Ready to download or share.
                    </p>
                  </div>
                )}
              </div>
              {/* ATS Score */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-gray-950 dark:text-white">ATS Score</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${calculateATSScore() >= 80 ? 'text-green-600 dark:text-green-400' : calculateATSScore() >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                      {calculateATSScore()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ease-out ${calculateATSScore() >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : calculateATSScore() >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 'bg-gradient-to-r from-red-500 to-pink-600'}`}
                    style={{ width: `${calculateATSScore()}%` }}
                  ></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <FiCheckCircle className={`w-4 h-4 ${resumeData.personalInfo.fullName.trim() && resumeData.personalInfo.email.trim() ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className="text-gray-600 dark:text-gray-400">Contact Information</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">15/15</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <FiCheckCircle className={`w-4 h-4 ${resumeData.summary.length > 100 ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className="text-gray-600 dark:text-gray-400">Professional Summary</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">10/10</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <FiCheckCircle className={`w-4 h-4 ${resumeData.experiences.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className="text-gray-600 dark:text-gray-400">Work Experience</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">25/25</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <FiCheckCircle className={`w-4 h-4 ${resumeData.skills.length >= 5 ? 'text-green-600' : 'text-yellow-600'}`} />
                      <span className="text-gray-600 dark:text-gray-400">Skills Section</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{resumeData.skills.length >= 5 ? '20/20' : '10/20'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <FiCheckCircle className={`w-4 h-4 ${resumeData.experiences.some(exp => exp.description.match(/\b(led|managed|developed|created|imimplemented|improved|increased|reduced|achieved)\b/i)) ? 'text-green-600' : 'text-yellow-600'}`} />
                      <span className="text-gray-600 dark:text-gray-400">Action Verbs</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">10/10</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    💡 Tips: Add quantified achievements and use action verbs to improve your ATS score.
                  </p>
                </div>
              </div>

              {/* Resume Analytics */}
              <div className="card">
                <h3 className="text-xl font-black text-gray-950 dark:text-white mb-4">Resume Analytics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Word Count</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {(resumeData.summary + ' ' + resumeData.experiences.map(exp => exp.description).join(' ') + ' ' + resumeData.education.map(edu => edu.description || '').join(' ')).split(' ').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Sections</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {[resumeData.summary, resumeData.experiences, resumeData.education, resumeData.skills].filter(section => Array.isArray(section) ? section.length > 0 : section.trim()).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Experience Years</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {resumeData.experiences.reduce((total, exp) => {
                        if (!exp.startDate) return total
                        const startYear = new Date(exp.startDate + '-01').getFullYear()
                        const endYear = exp.current ? new Date().getFullYear() : (exp.endDate ? new Date(exp.endDate + '-01').getFullYear() : startYear)
                        return total + (endYear - startYear)
                      }, 0)} years
                    </span>
                  </div>
                  {lastSaved && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Saved</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Auto-save Toggle */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-950 dark:text-white">Auto-save</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatically save changes every 30 seconds</p>
                  </div>
                  <button
                    onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${autoSaveEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSaveEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>

              {/* Enhanced AI Resume Generator */}
              <div className="card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-primary-500 rounded-full blur-3xl opacity-10"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-primary-600 p-3 rounded-2xl shadow-lg mr-4">
                      <FiStar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-950 dark:text-white tracking-tight">AI Assistant</h3>
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">Powered by AI</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 font-medium mb-6 leading-relaxed">
                    Let our AI analyze job requirements and optimize your resume content for maximum impact and ATS compatibility.
                  </p>
                  <div className="space-y-4">
                    <textarea
                      placeholder="Paste a job description here to get AI-powered recommendations and tailored content suggestions..."
                      rows={5}
                      className="profile-textarea text-sm"
                    />
                    <button className="w-full btn bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 text-white font-bold py-4 shadow-xl transform hover:scale-[1.02] transition-all duration-200">
                      <div className="flex items-center justify-center space-x-2">
                        <FiZap className="w-5 h-5" />
                        <span>Generate with AI</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-2xl font-black text-gray-950 dark:text-white mb-6 tracking-tight">Quick Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={addSampleData}
                    className="w-full flex items-center px-6 py-4 border-2 border-purple-200 dark:border-purple-800 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 font-semibold group"
                  >
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200">
                      <FiZap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-950 dark:text-white">Load Sample Data</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">See example resume content</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="w-full flex items-center px-6 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 font-semibold group"
                  >
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200">
                      <FiEye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-950 dark:text-white">Preview Resume</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">See how your resume looks</div>
                    </div>
                  </button>
                  <button
                    onClick={exportToPDF}
                    disabled={isExporting}
                    className="w-full flex items-center px-6 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 font-semibold group disabled:opacity-50"
                  >
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-200">
                      <FiDownload className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-950 dark:text-white">
                        {isExporting ? 'Exporting...' : 'Download PDF'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Ready to print</div>
                    </div>
                  </button>

                  <button
                    onClick={exportToWord}
                    disabled={isExporting}
                    className="w-full flex items-center px-6 py-4 border-2 border-blue-200 dark:border-blue-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 font-semibold group disabled:opacity-50"
                  >
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl mr-3 group-hover:scale-110 transition-transform duration-200">
                      <FiFileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-950 dark:text-white">
                        {isExporting ? 'Exporting...' : 'Download Word'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Editable format</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTemplateSelector(false)}></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-gray-950 dark:text-white tracking-tight">
                      Choose Your Template
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Select a professionally designed template that matches your style
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTemplateSelector(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <TemplatePicker
                  selectedTemplateId={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                  onPreview={handleTemplatePreview}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        templateId={previewTemplateId}
        isOpen={!!previewTemplateId}
        onClose={() => setPreviewTemplateId(null)}
        onSelect={handleTemplateSelect}
        selectedTemplateId={selectedTemplate}
        resumeData={resumeData}
      />
    </div>
  )
}

export default ResumeBuilderPageTailwind
