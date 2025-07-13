import React, { useState } from 'react'
import { FiBarChart, FiDownload, FiEye, FiGrid, FiSettings, FiShare2 } from 'react-icons/fi'
import { sampleResumeData } from './SampleData'
import TemplateAnalytics from './TemplateAnalytics'
import TemplateBuilder from './TemplateBuilder'
import TemplateShowcase from './TemplateShowcase'

interface TemplateDashboardProps {
  className?: string
}

type DashboardView = 'showcase' | 'builder' | 'analytics' | 'preview'

export const TemplateDashboard: React.FC<TemplateDashboardProps> = ({
  className = ''
}) => {
  const [activeView, setActiveView] = useState<DashboardView>('showcase')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('modern-professional')

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId)
    // Optionally switch to builder view when a template is selected
    if (activeView === 'showcase') {
      setActiveView('builder')
    }
  }

  const navigationItems = [
    {
      id: 'showcase' as DashboardView,
      label: 'Template Gallery',
      icon: FiGrid,
      description: 'Browse all available templates'
    },
    {
      id: 'builder' as DashboardView,
      label: 'Template Builder',
      icon: FiSettings,
      description: 'Customize and personalize templates'
    },
    {
      id: 'analytics' as DashboardView,
      label: 'Analytics',
      icon: FiBarChart,
      description: 'Template performance insights'
    }
  ]

  const renderActiveView = () => {
    switch (activeView) {
      case 'showcase':
        return (
          <TemplateShowcase
            selectedTemplateId={selectedTemplateId}
            onTemplateSelect={handleTemplateSelect}
            resumeData={sampleResumeData}
            showHeader={false}
          />
        )
      case 'builder':
        return (
          <TemplateBuilder
            selectedTemplateId={selectedTemplateId}
            onTemplateSelect={handleTemplateSelect}
            resumeData={sampleResumeData}
          />
        )
      case 'analytics':
        return <TemplateAnalytics />
      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Studio</h1>
              <p className="text-gray-600 mt-1">
                Create, customize, and manage professional resume templates
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              {selectedTemplateId && (
                <>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FiEye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <FiDownload className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <FiShare2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 px-6">
            {navigationItems.map(item => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg font-medium transition-colors relative ${activeView === item.id
                      ? 'bg-gray-50 text-blue-600 border-t-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                  {activeView === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Context Info */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {navigationItems.find(item => item.id === activeView)?.description}
                </span>
              </div>
              {selectedTemplateId && (
                <div className="text-sm text-gray-500">
                  Selected: <span className="font-medium text-gray-700">{selectedTemplateId}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Last updated: 2 minutes ago</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="transition-all duration-300 ease-in-out">
          {renderActiveView()}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Template Studio</h3>
              <p className="text-gray-600 text-sm">
                Professional resume templates designed to help you land your dream job.
                Customizable, ATS-friendly, and optimized for modern hiring practices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Template Guidelines</a></li>
                <li><a href="#" className="hover:text-gray-900">Design Best Practices</a></li>
                <li><a href="#" className="hover:text-gray-900">ATS Optimization</a></li>
                <li><a href="#" className="hover:text-gray-900">Industry Insights</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact Support</a></li>
                <li><a href="#" className="hover:text-gray-900">Feature Requests</a></li>
                <li><a href="#" className="hover:text-gray-900">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              © 2025 JobbyAI. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TemplateDashboard
