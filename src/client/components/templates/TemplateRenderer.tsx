import React from 'react'

interface TemplateRendererProps {
  templateId: string
  resumeData: any
  className?: string
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  resumeData,
  className = ''
}) => {
  const renderExecutiveSenior = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Executive Header */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 -m-8 mb-8 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {resumeData.personalInfo?.fullName || 'Executive Name'}
            </h1>
            <p className="text-emerald-100 text-xl font-semibold">
              {resumeData.personalInfo?.headline || 'Chief Executive Officer'}
            </p>
            <div className="flex space-x-6 mt-4 text-emerald-100">
              <span>{resumeData.personalInfo?.email || 'executive@company.com'}</span>
              <span>{resumeData.personalInfo?.phone || '+1 (555) 123-4567'}</span>
              <span>{resumeData.personalInfo?.location || 'New York, NY'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold">20+</div>
              <div className="text-sm">Years Experience</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
      </div>

      {/* Executive Summary */}
      {resumeData.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2">
            Executive Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">{resumeData.summary}</p>
        </div>
      )}

      {/* Key Achievements */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-emerald-700 mb-4">Key Achievements</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-3xl font-bold text-emerald-600">$50M+</div>
            <div className="text-sm text-gray-600">Revenue Growth</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-3xl font-bold text-emerald-600">500+</div>
            <div className="text-sm text-gray-600">Team Members</div>
          </div>
        </div>
      </div>

      {/* Experience */}
      {resumeData.experiences?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-200 pb-2">
            Executive Experience
          </h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-6 border-l-4 border-emerald-500 pl-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                <span className="text-emerald-600 font-semibold">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-emerald-700 font-semibold text-lg">{exp.company}</p>
              <p className="text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderTechDeveloper = () => (
    <div className="bg-gray-900 text-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Tech Header */}
      <div className="border-b border-green-500 pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-mono font-bold text-green-400 mb-2">
              {resumeData.personalInfo?.fullName || 'Developer Name'}
            </h1>
            <p className="text-green-300 text-lg">
              {resumeData.personalInfo?.headline || 'Full Stack Developer'}
            </p>
            <div className="flex space-x-4 mt-3 text-gray-300 text-sm">
              <span className="font-mono">{resumeData.personalInfo?.email || 'dev@example.com'}</span>
              <span className="font-mono">{resumeData.personalInfo?.phone || '+1-555-123-4567'}</span>
            </div>
          </div>
          <div className="text-right font-mono">
            <div className="text-green-400 text-xl">{'>'} whoami</div>
            <div className="text-gray-300">Software Engineer</div>
          </div>
        </div>
      </div>

      {/* Code Block Style Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <div className="bg-gray-800 p-4 rounded border-l-4 border-green-500">
            <div className="text-green-400 text-sm mb-2 font-mono">// About Me</div>
            <p className="text-gray-200 leading-relaxed">{resumeData.summary}</p>
          </div>
        </div>
      )}

      {/* Tech Skills Grid */}
      {resumeData.skills?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-mono text-green-400 mb-4">{'const skills = {'}</h2>
          <div className="grid grid-cols-2 gap-2 ml-4">
            {resumeData.skills.map((skill: any, index: number) => (
              <div key={index} className="font-mono text-gray-300">
                <span className="text-blue-400">"{skill.name || skill}"</span>
                <span className="text-gray-500">: </span>
                <span className="text-yellow-400">"expert"</span>
                <span className="text-gray-500">,</span>
              </div>
            ))}
          </div>
          <div className="text-green-400 font-mono mt-2">{'}'}</div>
        </div>
      )}

      {/* Experience as Code Commits */}
      {resumeData.experiences?.length > 0 && (
        <div>
          <h2 className="text-xl font-mono text-green-400 mb-4">git log --experience</h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-4 bg-gray-800 p-4 rounded border-l-2 border-yellow-500">
              <div className="font-mono text-sm">
                <span className="text-yellow-400">commit</span> {(Math.random().toString(36).substring(2, 15))}
              </div>
              <div className="font-mono text-sm text-gray-400 mb-2">
                Date: {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </div>
              <h3 className="text-white font-bold">{exp.title} @ {exp.company}</h3>
              <p className="text-gray-300 mt-2 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderAcademicResearcher = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Academic Header */}
      <div className="text-center border-b-2 border-amber-600 pb-6 mb-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          {resumeData.personalInfo?.fullName || 'Dr. Researcher Name'}
        </h1>
        <p className="text-amber-700 font-semibold text-lg">
          {resumeData.personalInfo?.headline || 'Research Professor'}
        </p>
        <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-600">
          <span>{resumeData.personalInfo?.email || 'researcher@university.edu'}</span>
          <span>{resumeData.personalInfo?.phone || '+1 (555) 123-4567'}</span>
          <span>{resumeData.personalInfo?.location || 'University City'}</span>
        </div>
      </div>

      {/* Research Interests */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-serif font-bold text-amber-700 mb-3">Research Interests</h2>
          <p className="text-gray-700 leading-relaxed italic">{resumeData.summary}</p>
        </div>
      )}

      {/* Academic Positions */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-serif font-bold text-amber-700 mb-3">Academic Positions</h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-4 pl-4 border-l border-amber-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-amber-700 font-semibold">{exp.company}</p>
                  <p className="text-gray-600 text-sm">{exp.location}</p>
                </div>
                <span className="text-sm text-gray-600 font-mono">
                  {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Publications Section */}
      <div className="mb-6">
        <h2 className="text-xl font-serif font-bold text-amber-700 mb-3">Selected Publications</h2>
        <div className="space-y-3">
          <div className="text-sm">
            <p className="text-gray-700">
              <strong>Author, A.</strong> (2023). "Significant Research Findings in Field."
              <em> Journal of Important Research</em>, 45(2), 123-145.
            </p>
          </div>
          <div className="text-sm">
            <p className="text-gray-700">
              <strong>Author, A.</strong> & Colleague, B. (2022). "Collaborative Study Results."
              <em> International Conference Proceedings</em>, pp. 78-92.
            </p>
          </div>
        </div>
      </div>

      {/* Research Areas */}
      {resumeData.skills?.length > 0 && (
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-700 mb-3">Research Areas & Methods</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill: any, index: number) => (
              <span key={index} className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-sm font-medium">
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderHealthcareMedical = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Medical Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 -m-8 mb-8 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {resumeData.personalInfo?.fullName || 'Dr. Medical Professional'}
            </h1>
            <p className="text-red-100 text-lg font-semibold">
              {resumeData.personalInfo?.headline || 'Medical Doctor'}
            </p>
            <div className="flex space-x-4 mt-3 text-red-100 text-sm">
              <span>{resumeData.personalInfo?.email || 'doctor@hospital.com'}</span>
              <span>{resumeData.personalInfo?.phone || '+1 (555) 123-4567'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">MD</div>
              <div className="text-sm">Licensed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-red-700 mb-3 border-b-2 border-red-200 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>
      )}

      {/* Medical Experience */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-red-700 mb-3 border-b-2 border-red-200 pb-2">
            Clinical Experience
          </h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-4 border-l-3 border-red-400 pl-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{exp.title}</h3>
                <span className="text-red-600 font-semibold text-sm">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-red-700 font-semibold">{exp.company} • {exp.location}</p>
              <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Medical Skills */}
      {resumeData.skills?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-red-700 mb-3 border-b-2 border-red-200 pb-2">
            Medical Expertise
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.skills.map((skill: any, index: number) => (
              <div key={index} className="bg-red-50 border border-red-200 p-2 rounded">
                <span className="text-red-800 font-medium text-sm">{skill.name || skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderSalesProfessional = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Sales Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 -m-8 mb-8 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {resumeData.personalInfo?.fullName || 'Sales Professional'}
            </h1>
            <p className="text-blue-100 text-lg font-semibold">
              {resumeData.personalInfo?.headline || 'Senior Sales Representative'}
            </p>
            <div className="flex space-x-4 mt-3 text-blue-100 text-sm">
              <span>{resumeData.personalInfo?.email || 'sales@company.com'}</span>
              <span>{resumeData.personalInfo?.phone || '+1 (555) 123-4567'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">150%</div>
              <div className="text-sm">Quota Achievement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Achievements */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-blue-700 mb-3">Key Achievements</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white p-3 rounded shadow">
            <div className="text-2xl font-bold text-blue-600">$2.5M</div>
            <div className="text-xs text-gray-600">Annual Revenue</div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="text-2xl font-bold text-blue-600">95%</div>
            <div className="text-xs text-gray-600">Client Retention</div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="text-2xl font-bold text-blue-600">250+</div>
            <div className="text-xs text-gray-600">Closed Deals</div>
          </div>
        </div>
      </div>

      {/* Sales Experience */}
      {resumeData.experiences?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-3 border-b-2 border-blue-200 pb-2">
            Sales Experience
          </h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-4 border-l-3 border-blue-400 pl-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{exp.title}</h3>
                <span className="text-blue-600 font-semibold text-sm">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-blue-700 font-semibold">{exp.company} • {exp.location}</p>
              <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderEducationTeacher = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Education Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 -m-8 mb-8 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {resumeData.personalInfo?.fullName || 'Education Professional'}
            </h1>
            <p className="text-indigo-100 text-lg font-semibold">
              {resumeData.personalInfo?.headline || 'Elementary School Teacher'}
            </p>
            <div className="flex space-x-4 mt-3 text-indigo-100 text-sm">
              <span>{resumeData.personalInfo?.email || 'teacher@school.edu'}</span>
              <span>{resumeData.personalInfo?.phone || '+1 (555) 123-4567'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm">Years Teaching</div>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Philosophy */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-indigo-700 mb-3 border-b-2 border-indigo-200 pb-2">
            Teaching Philosophy
          </h2>
          <p className="text-gray-700 leading-relaxed italic">{resumeData.summary}</p>
        </div>
      )}

      {/* Teaching Experience */}
      {resumeData.experiences?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-indigo-700 mb-3 border-b-2 border-indigo-200 pb-2">
            Teaching Experience
          </h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-4 border-l-3 border-indigo-400 pl-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{exp.title}</h3>
                <span className="text-indigo-600 font-semibold text-sm">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-indigo-700 font-semibold">{exp.company} • {exp.location}</p>
              <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderTemplate = () => {
    switch (templateId) {
      case 'executive-senior':
      case 'executive-corporate':
        return renderExecutiveSenior()
      case 'tech-developer':
      case 'tech-engineer':
      case 'tech-data':
        return renderTechDeveloper()
      case 'academic-researcher':
      case 'academic-professor':
        return renderAcademicResearcher()
      case 'healthcare-medical':
      case 'healthcare-wellness':
        return renderHealthcareMedical()
      case 'sales-professional':
      case 'sales-executive':
        return renderSalesProfessional()
      case 'education-teacher':
      case 'education-administration':
        return renderEducationTeacher()
      default:
        // Return a basic professional template for other IDs
        return (
          <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
            <div className="text-center border-b pb-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {resumeData.personalInfo?.fullName || 'Professional Name'}
              </h1>
              <p className="text-blue-600 font-semibold text-lg">
                {resumeData.personalInfo?.headline || 'Professional Title'}
              </p>
            </div>
            {resumeData.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-blue-600 mb-3">Summary</h2>
                <p className="text-gray-700">{resumeData.summary}</p>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className={className}>
      {renderTemplate()}
    </div>
  )
}

export default TemplateRenderer
