import React from 'react'
import { type TemplateData } from './ResumeTemplates'
import TemplateRenderer from './TemplateRenderer'

interface TemplatePreviewProps {
  template: TemplateData
  resumeData: any
  className?: string
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  resumeData,
  className = ''
}) => {
  const renderClassicProfessional = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Header */}
      <div className="text-center border-b-2 border-blue-600 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {resumeData.personalInfo?.fullName || 'John Doe'}
        </h1>
        <p className="text-blue-600 font-semibold text-lg mb-3">
          {resumeData.personalInfo?.headline || 'Professional Title'}
        </p>
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          <span>{resumeData.personalInfo?.email || 'email@example.com'}</span>
          <span>•</span>
          <span>{resumeData.personalInfo?.phone || '(555) 123-4567'}</span>
          <span>•</span>
          <span>{resumeData.personalInfo?.location || 'City, State'}</span>
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3">Work Experience</h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{exp.title}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-gray-700 font-semibold">{exp.company} • {exp.location}</p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill: any, index: number) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderModernProfessional = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-1 bg-indigo-50 p-6 -m-8 mr-0">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {(resumeData.personalInfo?.fullName || 'JD').split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {resumeData.personalInfo?.fullName || 'John Doe'}
            </h1>
            <p className="text-indigo-600 font-semibold">
              {resumeData.personalInfo?.headline || 'Professional Title'}
            </p>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>{resumeData.personalInfo?.email || 'email@example.com'}</p>
              <p>{resumeData.personalInfo?.phone || '(555) 123-4567'}</p>
              <p>{resumeData.personalInfo?.location || 'City, State'}</p>
            </div>
          </div>

          {/* Skills */}
          {resumeData.skills?.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Skills</h3>
              <div className="space-y-2">
                {resumeData.skills.slice(0, 6).map((skill: any, index: number) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>{skill.name || skill}</span>
                      <span className="text-indigo-600">●●●●○</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-2">
          {/* Summary */}
          {resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-indigo-600 mb-3 border-b-2 border-indigo-200 pb-1">
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData.experiences?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-indigo-600 mb-3 border-b-2 border-indigo-200 pb-1">
                Experience
              </h2>
              {resumeData.experiences.map((exp: any, index: number) => (
                <div key={index} className="mb-4 border-l-2 border-indigo-200 pl-4">
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-indigo-600 font-semibold">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                  <p className="text-gray-700 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderCreativeDesigner = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-200 rounded-full -ml-12 -mb-12"></div>

      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-4xl font-black text-gray-900 mb-2">
          {resumeData.personalInfo?.fullName || 'John Doe'}
        </h1>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 w-24 mx-auto mb-4"></div>
        <p className="text-purple-600 font-bold text-xl">
          {resumeData.personalInfo?.headline || 'Creative Professional'}
        </p>
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <span className="bg-purple-100 px-3 py-1 rounded-full">
            {resumeData.personalInfo?.email || 'email@example.com'}
          </span>
          <span className="bg-pink-100 px-3 py-1 rounded-full">
            {resumeData.personalInfo?.phone || '(555) 123-4567'}
          </span>
        </div>
      </div>

      {/* Summary with Creative Layout */}
      {resumeData.summary && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-purple-700 mb-3">Creative Vision</h2>
          <p className="text-gray-700 leading-relaxed italic">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience with Creative Cards */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Experience</h2>
          <div className="space-y-4">
            {resumeData.experiences.map((exp: any, index: number) => (
              <div key={index} className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-purple-600 font-semibold">{exp.company}</p>
                    <p className="text-sm text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                </div>
                <p className="text-gray-700 mt-3">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderMinimalClean = () => (
    <div className="bg-white p-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-8 mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          {resumeData.personalInfo?.fullName || 'John Doe'}
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          {resumeData.personalInfo?.headline || 'Professional Title'}
        </p>
        <div className="flex space-x-8 text-sm text-gray-500">
          <span>{resumeData.personalInfo?.email || 'email@example.com'}</span>
          <span>{resumeData.personalInfo?.phone || '(555) 123-4567'}</span>
          <span>{resumeData.personalInfo?.location || 'City, State'}</span>
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-loose text-lg">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-light text-gray-900 mb-6 uppercase tracking-wide">Experience</h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{exp.company} • {exp.location}</p>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills?.length > 0 && (
        <div>
          <h2 className="text-xl font-light text-gray-900 mb-6 uppercase tracking-wide">Skills</h2>
          <div className="flex flex-wrap gap-4">
            {resumeData.skills.map((skill: any, index: number) => (
              <span key={index} className="text-gray-700 border-b border-gray-300 pb-1">
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderTemplate = () => {
    // Use specialized renderers for specific templates
    if (['executive-senior', 'executive-corporate', 'tech-developer', 'tech-engineer', 'academic-researcher', 'academic-professor'].includes(template.id)) {
      return <TemplateRenderer templateId={template.id} resumeData={resumeData} />
    }

    // Use built-in renderers for basic templates
    switch (template.id) {
      case 'classic-professional':
        return renderClassicProfessional()
      case 'modern-professional':
        return renderModernProfessional()
      case 'creative-designer':
      case 'creative-marketing':
        return renderCreativeDesigner()
      case 'minimal-clean':
      case 'minimal-modern':
        return renderMinimalClean()
      default:
        return renderClassicProfessional()
    }
  }

  return (
    <div className={`${className}`} style={{ transform: 'scale(0.6)', transformOrigin: 'top left' }}>
      {renderTemplate()}
    </div>
  )
}

export default TemplatePreview
