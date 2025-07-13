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

  // Modern Professional Template
  const renderModernProfessional = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Modern Header with Geometric Elements */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 -m-8 mb-8 rounded-t-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 transform rotate-45 -ml-12 -mb-12"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            {resumeData.personalInfo?.fullName || 'Professional Name'}
          </h1>
          <p className="text-indigo-100 text-xl font-medium">
            {resumeData.personalInfo?.headline || 'Modern Professional'}
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-indigo-100">
            <span>{resumeData.personalInfo?.email || 'professional@company.com'}</span>
            <span>{resumeData.personalInfo?.phone || '(555) 123-4567'}</span>
            <span>{resumeData.personalInfo?.location || 'City, State'}</span>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 mr-3"></div>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 mr-3"></div>
            Professional Experience
          </h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-6 relative">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                    <span className="text-indigo-600 font-semibold text-sm">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-indigo-700 font-semibold mb-2">{exp.company}</p>
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              </div>
              {index < resumeData.experiences.length - 1 && (
                <div className="absolute left-1 top-8 w-0.5 h-16 bg-indigo-200"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {resumeData.skills?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
            <div className="w-1 h-6 bg-indigo-600 mr-3"></div>
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {resumeData.skills.map((skill: any, index: number) => (
              <div key={index} className="bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200">
                <span className="text-indigo-700 font-medium">{skill.name || skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Classic Professional Template
  const renderClassicProfessional = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Traditional Header */}
      <div className="text-center border-b-2 border-blue-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          {resumeData.personalInfo?.fullName || 'Professional Name'}
        </h1>
        <p className="text-blue-700 text-lg font-semibold">
          {resumeData.personalInfo?.headline || 'Professional Title'}
        </p>
        <div className="flex justify-center space-x-8 mt-4 text-gray-600">
          <span>{resumeData.personalInfo?.email || 'email@company.com'}</span>
          <span>{resumeData.personalInfo?.phone || '(555) 123-4567'}</span>
          <span>{resumeData.personalInfo?.location || 'City, State'}</span>
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">
            PROFESSIONAL EXPERIENCE
          </h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-blue-700 font-semibold">{exp.company} • {exp.location}</p>
                </div>
                <span className="text-gray-600 font-medium">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed ml-4">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Core Competencies */}
      {resumeData.skills?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">
            CORE COMPETENCIES
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill: any, index: number) => (
              <span key={index} className="text-gray-700 font-medium">
                {skill.name || skill}
                {index < resumeData.skills.length - 1 && ' • '}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Creative Designer Template
  const renderCreativeDesigner = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg overflow-hidden">
      {/* Creative Header with Bold Design */}
      <div className="relative -m-8 mb-8 p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 transform rotate-12 -ml-16 -mb-16"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3 tracking-wide">
            {resumeData.personalInfo?.fullName || 'Creative Professional'}
          </h1>
          <p className="text-purple-100 text-xl font-light tracking-wider">
            {resumeData.personalInfo?.headline || 'Creative Designer'}
          </p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <span className="text-purple-100">{resumeData.personalInfo?.email || 'creative@design.com'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
              <span className="text-purple-100">{resumeData.personalInfo?.phone || '(555) 123-4567'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Creative Bio */}
      {resumeData.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Creative Vision
          </h2>
          <div className="border-l-4 border-purple-500 pl-6 italic">
            <p className="text-gray-700 leading-relaxed text-lg">{resumeData.summary}</p>
          </div>
        </div>
      )}

      {/* Experience as Portfolio Projects */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Creative Journey
          </h2>
          <div className="space-y-6">
            {resumeData.experiences.map((exp: any, index: number) => (
              <div key={index} className="relative p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
                <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                <p className="text-purple-700 font-semibold mb-1">{exp.company}</p>
                <span className="text-sm text-gray-500 font-medium">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
                <p className="text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Creative Skills */}
      {resumeData.skills?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Creative Toolkit
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {resumeData.skills.map((skill: any, index: number) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg text-center hover:from-purple-200 hover:to-pink-200 transition-colors">
                  <span className="text-purple-700 font-semibold">{skill.name || skill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Minimal Clean Template
  const renderMinimalClean = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Minimal Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          {resumeData.personalInfo?.fullName || 'Your Name'}
        </h1>
        <p className="text-gray-600 text-lg font-light mb-4">
          {resumeData.personalInfo?.headline || 'Professional Title'}
        </p>
        <div className="flex space-x-6 text-sm text-gray-500">
          <span>{resumeData.personalInfo?.email || 'email@example.com'}</span>
          <span>{resumeData.personalInfo?.phone || '(555) 123-4567'}</span>
          <span>{resumeData.personalInfo?.location || 'City, State'}</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-300 mt-6"></div>
      </div>

      {/* About */}
      {resumeData.summary && (
        <div className="mb-12">
          <p className="text-gray-700 leading-relaxed text-lg font-light">
            {resumeData.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-light text-gray-900 mb-8 tracking-wider">EXPERIENCE</h2>
          <div className="space-y-8">
            {resumeData.experiences.map((exp: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{exp.title}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500 font-light">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed font-light mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills?.length > 0 && (
        <div>
          <h2 className="text-xl font-light text-gray-900 mb-6 tracking-wider">SKILLS</h2>
          <div className="flex flex-wrap gap-3">
            {resumeData.skills.map((skill: any, index: number) => (
              <span key={index} className="text-gray-600 font-light">
                {skill.name || skill}
                {index < resumeData.skills.length - 1 && ','}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Marketing Professional Template
  const renderCreativeMarketing = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Marketing Header with Brand Feel */}
      <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white p-8 -m-8 mb-8 rounded-t-lg">
        <div className="absolute top-0 right-0 w-20 h-20 border-4 border-white/20 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 transform rotate-45 -ml-8 -mb-8"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 tracking-wide">
            {resumeData.personalInfo?.fullName || 'Marketing Professional'}
          </h1>
          <p className="text-pink-100 text-xl font-medium">
            {resumeData.personalInfo?.headline || 'Digital Marketing Specialist'}
          </p>
          <div className="flex flex-wrap gap-6 mt-4 text-pink-100">
            <span>📧 {resumeData.personalInfo?.email || 'marketing@brand.com'}</span>
            <span>📱 {resumeData.personalInfo?.phone || '(555) 123-4567'}</span>
            <span>📍 {resumeData.personalInfo?.location || 'Marketing Hub'}</span>
          </div>
        </div>
      </div>

      {/* Brand Story */}
      {resumeData.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 mb-4">
            Brand Story
          </h2>
          <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-6 rounded-lg border-l-4 border-pink-500">
            <p className="text-gray-700 leading-relaxed text-lg italic">{resumeData.summary}</p>
          </div>
        </div>
      )}

      {/* Campaign Highlights */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 mb-6">
            Campaign Portfolio
          </h2>
          <div className="grid gap-6">
            {resumeData.experiences.map((exp: any, index: number) => (
              <div key={index} className="relative bg-white border-2 border-pink-200 rounded-xl p-6 hover:border-pink-400 transition-all duration-300 hover:shadow-lg">
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
                </div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-pink-600 font-semibold text-lg">{exp.company}</p>
                  </div>
                  <span className="bg-gradient-to-r from-pink-100 to-orange-100 px-3 py-1 rounded-full text-sm font-medium text-pink-700">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marketing Arsenal */}
      {resumeData.skills?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600 mb-4">
            Marketing Arsenal
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {resumeData.skills.map((skill: any, index: number) => (
              <div key={index} className="group relative">
                <div className="bg-gradient-to-r from-pink-100 to-orange-100 p-4 rounded-lg text-center border border-pink-200 hover:from-pink-200 hover:to-orange-200 transition-all duration-300">
                  <span className="text-pink-700 font-semibold">{skill.name || skill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Minimal Modern Template
  const renderMinimalModern = () => (
    <div className="bg-gray-50 p-8 max-w-4xl mx-auto shadow-lg">
      {/* Ultra Minimal Header */}
      <div className="mb-16">
        <h1 className="text-5xl font-extralight text-gray-900 mb-4 tracking-wide">
          {resumeData.personalInfo?.fullName || 'Name'}
        </h1>
        <div className="w-24 h-px bg-gray-900 mb-6"></div>
        <p className="text-gray-600 text-xl font-light tracking-wide">
          {resumeData.personalInfo?.headline || 'Title'}
        </p>
        <div className="mt-8 space-y-1 text-sm text-gray-500 font-light">
          <div>{resumeData.personalInfo?.email || 'email@example.com'}</div>
          <div>{resumeData.personalInfo?.phone || '000.000.0000'}</div>
          <div>{resumeData.personalInfo?.location || 'Location'}</div>
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-16">
          <div className="max-w-2xl">
            <p className="text-gray-700 leading-loose text-lg font-light">
              {resumeData.summary}
            </p>
          </div>
        </div>
      )}

      {/* Experience */}
      {resumeData.experiences?.length > 0 && (
        <div className="mb-16">
          <h2 className="text-sm font-medium text-gray-900 mb-12 tracking-widest uppercase">
            Experience
          </h2>
          <div className="space-y-12">
            {resumeData.experiences.map((exp: any, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:text-right">
                  <div className="text-sm text-gray-500 font-light">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-xl font-medium text-gray-900 mb-1">{exp.title}</h3>
                  <p className="text-gray-600 mb-4">{exp.company}</p>
                  <p className="text-gray-700 leading-relaxed font-light">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills?.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-gray-900 mb-8 tracking-widest uppercase">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {resumeData.skills.map((skill: any, index: number) => (
              <div key={index} className="text-gray-600 font-light">
                {skill.name || skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Executive Corporate Template
  const renderExecutiveCorporate = () => (
    <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg">
      {/* Corporate Executive Header */}
      <div className="relative bg-gradient-to-r from-slate-800 to-gray-900 text-white p-8 -m-8 mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 border border-white/20 -mr-16 -mt-16"></div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-3">
              {resumeData.personalInfo?.fullName || 'Executive Name'}
            </h1>
            <p className="text-slate-200 text-2xl font-light">
              {resumeData.personalInfo?.headline || 'Chief Executive Officer'}
            </p>
            <div className="flex flex-wrap gap-6 mt-6 text-slate-300">
              <span>{resumeData.personalInfo?.email || 'ceo@company.com'}</span>
              <span>{resumeData.personalInfo?.phone || '+1 (555) 123-4567'}</span>
              <span>{resumeData.personalInfo?.location || 'Corporate HQ'}</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="inline-block bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-slate-300 text-sm uppercase tracking-wide">Years Leadership</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      {resumeData.summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <div className="w-2 h-8 bg-slate-800 mr-4"></div>
            Executive Profile
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">{resumeData.summary}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="mb-8 bg-slate-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Leadership Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded shadow-sm">
            <div className="text-3xl font-bold text-slate-700 mb-1">$100M+</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Revenue Managed</div>
          </div>
          <div className="text-center p-4 bg-white rounded shadow-sm">
            <div className="text-3xl font-bold text-slate-700 mb-1">1000+</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Team Members</div>
          </div>
          <div className="text-center p-4 bg-white rounded shadow-sm">
            <div className="text-3xl font-bold text-slate-700 mb-1">15+</div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">Markets</div>
          </div>
        </div>
      </div>

      {/* Executive Experience */}
      {resumeData.experiences?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <div className="w-2 h-8 bg-slate-800 mr-4"></div>
            Executive Leadership
          </h2>
          {resumeData.experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-8 border-l-4 border-slate-600 pl-8 pb-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-slate-700 font-semibold text-lg">{exp.company}</p>
                </div>
                <span className="text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderTemplate = () => {
    switch (templateId) {
      // Professional Templates
      case 'classic-professional':
        return renderClassicProfessional()
      case 'modern-professional':
        return renderModernProfessional()

      // Executive Templates
      case 'executive-senior':
        return renderExecutiveSenior()
      case 'executive-corporate':
        return renderExecutiveCorporate()
      case 'executive-modern':
        return renderExecutiveSenior() // Use senior as fallback

      // Creative Templates
      case 'creative-designer':
        return renderCreativeDesigner()
      case 'creative-marketing':
        return renderCreativeMarketing()
      case 'creative-media':
      case 'creative-arts':
        return renderCreativeDesigner() // Use designer as fallback

      // Minimal Templates
      case 'minimal-clean':
        return renderMinimalClean()
      case 'minimal-modern':
        return renderMinimalModern()
      case 'minimal-elegant':
        return renderMinimalClean() // Use clean as fallback

      // Tech Templates
      case 'tech-developer':
      case 'tech-engineer':
      case 'tech-data':
        return renderTechDeveloper()

      // Academic Templates
      case 'academic-researcher':
      case 'academic-professor':
        return renderAcademicResearcher()

      // Healthcare Templates
      case 'healthcare-medical':
      case 'healthcare-wellness':
        return renderHealthcareMedical()

      // Sales Templates
      case 'sales-professional':
      case 'sales-executive':
        return renderSalesProfessional()

      // Education Templates
      case 'education-teacher':
      case 'education-administration':
        return renderEducationTeacher()

      default:
        // Return modern professional as default
        return renderModernProfessional()
    }
  }

  return (
    <div className={className}>
      {renderTemplate()}
    </div>
  )
}

export default TemplateRenderer
