import React from 'react'
import { FiAward, FiBriefcase, FiCamera, FiCode, FiEye, FiFileText, FiHeart, FiPenTool, FiStar, FiTrendingUp, FiUser, FiZap } from 'react-icons/fi'

export interface TemplateData {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  preview: string
  category: 'professional' | 'creative' | 'minimal' | 'executive' | 'tech' | 'academic' | 'healthcare' | 'sales' | 'education'
  features: string[]
  bestFor?: string[]
  popularityScore?: number
}

export const resumeTemplates: TemplateData[] = [
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional corporate design with clean lines and professional typography',
    icon: FiFileText,
    color: 'blue',
    preview: 'A timeless design perfect for corporate environments and traditional industries',
    category: 'professional',
    features: ['ATS-Friendly', 'Clean Layout', 'Professional Fonts', 'Conservative Design'],
    bestFor: ['Corporate roles', 'Finance', 'Legal', 'Consulting'],
    popularityScore: 95
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Contemporary professional design with subtle color accents',
    icon: FiBriefcase,
    color: 'indigo',
    preview: 'Modern twist on professional design with strategic use of color and spacing',
    category: 'professional',
    features: ['Modern Typography', 'Color Accents', 'Professional', 'Clean Structure'],
    bestFor: ['Business development', 'Project management', 'Operations'],
    popularityScore: 92
  },
  {
    id: 'executive-modern',
    name: 'Executive Modern',
    description: 'Sleek professional design for modern executives',
    icon: FiTrendingUp,
    color: 'slate',
    preview: 'Contemporary executive template with strategic leadership focus',
    category: 'professional',
    features: ['Leadership Focus', 'Modern Design', 'Strategic Layout', 'Results Oriented'],
    bestFor: ['Senior management', 'Directors', 'VPs'],
    popularityScore: 88
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Bold and creative layout perfect for design professionals',
    icon: FiStar,
    color: 'purple',
    preview: 'Eye-catching design that showcases creativity while maintaining readability',
    category: 'creative',
    features: ['Creative Layout', 'Color Blocks', 'Visual Hierarchy', 'Portfolio Ready'],
    bestFor: ['Graphic design', 'UX/UI design', 'Art direction'],
    popularityScore: 89
  },
  {
    id: 'creative-marketing',
    name: 'Creative Marketing',
    description: 'Dynamic layout for marketing and creative professionals',
    icon: FiZap,
    color: 'pink',
    preview: 'Energetic design that reflects marketing expertise and creative thinking',
    category: 'creative',
    features: ['Dynamic Sections', 'Marketing Focus', 'Brand Friendly', 'Social Media Ready'],
    bestFor: ['Digital marketing', 'Brand management', 'Content creation'],
    popularityScore: 85
  },
  {
    id: 'creative-media',
    name: 'Creative Media',
    description: 'Vibrant design for media and entertainment professionals',
    icon: FiCamera,
    color: 'rose',
    preview: 'Media-focused template highlighting creative projects and portfolio work',
    category: 'creative',
    features: ['Portfolio Focus', 'Media Showcase', 'Project Highlights', 'Visual Impact'],
    bestFor: ['Photography', 'Video production', 'Media production'],
    popularityScore: 78
  },
  {
    id: 'creative-arts',
    name: 'Creative Arts',
    description: 'Artistic layout for creative arts professionals',
    icon: FiPenTool,
    color: 'amber',
    preview: 'Artistic design perfect for showcasing creative talent and artistic achievements',
    category: 'creative',
    features: ['Artistic Layout', 'Creative Expression', 'Portfolio Ready', 'Unique Design'],
    bestFor: ['Fine arts', 'Illustration', 'Creative writing'],
    popularityScore: 72
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Ultra-clean design focusing on content with minimal distractions',
    icon: FiEye,
    color: 'gray',
    preview: 'Minimalist approach that lets your content speak for itself',
    category: 'minimal',
    features: ['Ultra Clean', 'Content Focus', 'White Space', 'Easy Reading'],
    bestFor: ['Any industry', 'ATS systems', 'Conservative fields'],
    popularityScore: 91
  },
  {
    id: 'minimal-modern',
    name: 'Minimal Modern',
    description: 'Contemporary minimal design with strategic use of space',
    icon: FiUser,
    color: 'slate',
    preview: 'Modern minimalism with perfect balance of content and white space',
    category: 'minimal',
    features: ['Minimal Design', 'Modern Touch', 'Strategic Spacing', 'Typography Focus'],
    bestFor: ['Tech roles', 'Startups', 'Modern companies'],
    popularityScore: 87
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    description: 'Sophisticated minimal design with elegant typography',
    icon: FiFileText,
    color: 'stone',
    preview: 'Refined minimalism with sophisticated design elements',
    category: 'minimal',
    features: ['Elegant Typography', 'Sophisticated', 'Refined Design', 'Premium Feel'],
    bestFor: ['Luxury brands', 'High-end services', 'Executive roles'],
    popularityScore: 83
  },
  {
    id: 'executive-senior',
    name: 'Executive Senior',
    description: 'Sophisticated design for senior leadership positions',
    icon: FiAward,
    color: 'emerald',
    preview: 'Commanding presence perfect for C-level and senior executive roles',
    category: 'executive',
    features: ['Leadership Focus', 'Sophisticated', 'Achievement Oriented', 'Executive Style'],
    bestFor: ['CEO', 'C-suite', 'Senior executives'],
    popularityScore: 90
  },
  {
    id: 'executive-corporate',
    name: 'Executive Corporate',
    description: 'Premium corporate design for high-level positions',
    icon: FiBriefcase,
    color: 'teal',
    preview: 'Premium design that reflects corporate leadership and success',
    category: 'executive',
    features: ['Corporate Elite', 'Premium Design', 'Leadership Ready', 'Board Level'],
    bestFor: ['Board positions', 'Corporate leadership', 'Fortune 500'],
    popularityScore: 86
  },
  {
    id: 'tech-developer',
    name: 'Tech Developer',
    description: 'Code-friendly design optimized for software developers',
    icon: FiCode,
    color: 'green',
    preview: 'Technical layout that highlights coding skills and technical achievements',
    category: 'tech',
    features: ['Code Friendly', 'Technical Skills', 'GitHub Integration', 'Dev Portfolio'],
    bestFor: ['Software development', 'Full-stack', 'Frontend/Backend'],
    popularityScore: 94
  },
  {
    id: 'tech-engineer',
    name: 'Tech Engineer',
    description: 'Engineering-focused design for technical professionals',
    icon: FiZap,
    color: 'blue',
    preview: 'Engineering excellence with technical project highlights',
    category: 'tech',
    features: ['Engineering Focus', 'Project Highlights', 'Technical Metrics', 'Innovation Ready'],
    bestFor: ['Engineering', 'DevOps', 'System architecture'],
    popularityScore: 89
  },
  {
    id: 'tech-data',
    name: 'Tech Data Science',
    description: 'Data-focused design for data scientists and analysts',
    icon: FiTrendingUp,
    color: 'violet',
    preview: 'Data science template highlighting analytical skills and insights',
    category: 'tech',
    features: ['Data Focus', 'Analytics Showcase', 'Research Ready', 'Metrics Driven'],
    bestFor: ['Data science', 'Analytics', 'Machine learning'],
    popularityScore: 82
  },
  {
    id: 'academic-researcher',
    name: 'Academic Researcher',
    description: 'Research-focused design for academic professionals',
    icon: FiFileText,
    color: 'amber',
    preview: 'Academic excellence with research publications and scholarly achievements',
    category: 'academic',
    features: ['Research Focus', 'Publication Ready', 'Academic Format', 'Scholarly Design'],
    bestFor: ['Research positions', 'Academia', 'Think tanks'],
    popularityScore: 75
  },
  {
    id: 'academic-professor',
    name: 'Academic Professor',
    description: 'Comprehensive academic design for faculty positions',
    icon: FiAward,
    color: 'orange',
    preview: 'Complete academic CV format with teaching and research highlights',
    category: 'academic',
    features: ['CV Format', 'Teaching Focus', 'Research Highlights', 'Academic Excellence'],
    bestFor: ['Faculty positions', 'Teaching roles', 'Academic leadership'],
    popularityScore: 73
  },
  {
    id: 'healthcare-medical',
    name: 'Healthcare Medical',
    description: 'Professional medical design for healthcare professionals',
    icon: FiHeart,
    color: 'red',
    preview: 'Medical-focused template emphasizing patient care and clinical experience',
    category: 'healthcare',
    features: ['Medical Focus', 'Clinical Experience', 'Patient Care', 'Healthcare Standards'],
    bestFor: ['Doctors', 'Nurses', 'Medical specialists'],
    popularityScore: 80
  },
  {
    id: 'healthcare-wellness',
    name: 'Healthcare Wellness',
    description: 'Wellness-focused design for health and wellness professionals',
    icon: FiHeart,
    color: 'green',
    preview: 'Wellness template highlighting holistic health and patient wellness',
    category: 'healthcare',
    features: ['Wellness Focus', 'Holistic Approach', 'Patient Centered', 'Health Emphasis'],
    bestFor: ['Wellness coaches', 'Therapists', 'Nutritionists'],
    popularityScore: 76
  },
  {
    id: 'sales-professional',
    name: 'Sales Professional',
    description: 'Results-driven design for sales professionals',
    icon: FiTrendingUp,
    color: 'blue',
    preview: 'Sales-focused template highlighting achievements and revenue growth',
    category: 'sales',
    features: ['Results Driven', 'Achievement Focus', 'Sales Metrics', 'Performance Oriented'],
    bestFor: ['Sales representatives', 'Account managers', 'Business development'],
    popularityScore: 84
  },
  {
    id: 'sales-executive',
    name: 'Sales Executive',
    description: 'Executive sales design for senior sales leadership',
    icon: FiTrendingUp,
    color: 'emerald',
    preview: 'Senior sales template emphasizing leadership and strategic sales growth',
    category: 'sales',
    features: ['Sales Leadership', 'Strategic Focus', 'Team Management', 'Revenue Growth'],
    bestFor: ['Sales directors', 'VP of Sales', 'Sales executives'],
    popularityScore: 81
  },
  {
    id: 'education-teacher',
    name: 'Education Teacher',
    description: 'Educational design for teachers and educators',
    icon: FiStar,
    color: 'indigo',
    preview: 'Education-focused template highlighting teaching experience and student outcomes',
    category: 'education',
    features: ['Teaching Focus', 'Student Outcomes', 'Educational Philosophy', 'Classroom Management'],
    bestFor: ['Teachers', 'Educators', 'School administrators'],
    popularityScore: 77
  },
  {
    id: 'education-administration',
    name: 'Education Administration',
    description: 'Administrative design for education leadership',
    icon: FiAward,
    color: 'purple',
    preview: 'Educational leadership template for administrative and leadership roles',
    category: 'education',
    features: ['Leadership Focus', 'Administrative Excellence', 'Educational Strategy', 'Policy Development'],
    bestFor: ['Principals', 'Superintendents', 'Education directors'],
    popularityScore: 74
  }
]

// Helper function to get best-for information
export const getBestForList = (category: string): string[] => {
  const categoryMap: Record<string, string[]> = {
    professional: ['Corporate environments', 'Business roles', 'Traditional industries', 'Client-facing positions'],
    creative: ['Design agencies', 'Creative industries', 'Portfolio-heavy roles', 'Brand-focused companies'],
    minimal: ['Tech companies', 'Startups', 'Modern workplaces', 'ATS-heavy industries'],
    executive: ['C-level positions', 'Senior leadership', 'Board positions', 'High-stakes roles'],
    tech: ['Software companies', 'Tech startups', 'Engineering roles', 'Technical positions'],
    academic: ['Universities', 'Research institutions', 'Academic roles', 'Educational settings'],
    healthcare: ['Hospitals', 'Clinics', 'Healthcare systems', 'Medical practices'],
    sales: ['Sales organizations', 'Revenue-focused roles', 'Client relations', 'Business development'],
    education: ['Schools', 'Educational institutions', 'Training organizations', 'Academic administration']
  }
  return categoryMap[category] || ['Various industries']
}

export const getTemplatesByCategory = (category?: string) => {
  if (!category) return resumeTemplates
  return resumeTemplates.filter(template => template.category === category)
}

export const getTemplateById = (id: string) => {
  return resumeTemplates.find(template => template.id === id)
}

export const getPopularTemplates = (limit: number = 6) => {
  return resumeTemplates
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
    .slice(0, limit)
}

export const templateCategories = [
  { id: 'all', name: 'All Templates', count: resumeTemplates.length },
  { id: 'professional', name: 'Professional', count: getTemplatesByCategory('professional').length },
  { id: 'creative', name: 'Creative', count: getTemplatesByCategory('creative').length },
  { id: 'minimal', name: 'Minimal', count: getTemplatesByCategory('minimal').length },
  { id: 'executive', name: 'Executive', count: getTemplatesByCategory('executive').length },
  { id: 'tech', name: 'Tech', count: getTemplatesByCategory('tech').length },
  { id: 'academic', name: 'Academic', count: getTemplatesByCategory('academic').length },
  { id: 'healthcare', name: 'Healthcare', count: getTemplatesByCategory('healthcare').length },
  { id: 'sales', name: 'Sales', count: getTemplatesByCategory('sales').length },
  { id: 'education', name: 'Education', count: getTemplatesByCategory('education').length }
]
