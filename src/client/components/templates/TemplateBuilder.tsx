import React, { useState } from 'react'
import { FiCheck, FiCopy, FiDownload, FiEdit3, FiEye, FiSettings, FiStar, FiTrendingUp, FiX } from 'react-icons/fi'
import { resumeTemplates, type TemplateData } from './ResumeTemplates'
import { sampleResumeData } from './SampleData'
import TemplateRenderer from './TemplateRenderer'

interface TemplateBuilderProps {
  selectedTemplateId?: string
  onTemplateSelect: (templateId: string) => void
  resumeData?: any
  className?: string
}

interface TemplateCustomization {
  colorScheme: string
  fontSize: 'small' | 'medium' | 'large'
  spacing: 'compact' | 'normal' | 'spacious'
  accentColor: string
}

const colorSchemes = [
  { id: 'blue', name: 'Professional Blue', colors: ['#3B82F6', '#1E40AF', '#1D4ED8'] },
  { id: 'purple', name: 'Creative Purple', colors: ['#8B5CF6', '#7C3AED', '#6D28D9'] },
  { id: 'green', name: 'Nature Green', colors: ['#10B981', '#059669', '#047857'] },
  { id: 'red', name: 'Bold Red', colors: ['#EF4444', '#DC2626', '#B91C1C'] },
  { id: 'gray', name: 'Minimal Gray', colors: ['#6B7280', '#4B5563', '#374151'] },
  { id: 'indigo', name: 'Corporate Indigo', colors: ['#6366F1', '#4F46E5', '#4338CA'] }
]

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  selectedTemplateId,
  onTemplateSelect,
  resumeData = sampleResumeData,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'customize' | 'compare'>('templates')
  const [customization, setCustomization] = useState<TemplateCustomization>({
    colorScheme: 'blue',
    fontSize: 'medium',
    spacing: 'normal',
    accentColor: '#3B82F6'
  })
  const [compareTemplates, setCompareTemplates] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  const selectedTemplate = resumeTemplates.find(t => t.id === selectedTemplateId)

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId)
  }

  const handleAddToCompare = (templateId: string) => {
    if (compareTemplates.length < 3 && !compareTemplates.includes(templateId)) {
      setCompareTemplates([...compareTemplates, templateId])
    }
  }

  const handleRemoveFromCompare = (templateId: string) => {
    setCompareTemplates(compareTemplates.filter(id => id !== templateId))
  }

  const handleToggleFavorite = (templateId: string) => {
    if (favorites.includes(templateId)) {
      setFavorites(favorites.filter(id => id !== templateId))
    } else {
      setFavorites([...favorites, templateId])
    }
  }

  const renderTemplateCard = (template: TemplateData, isSelected: boolean = false) => (
    <div
      key={template.id}
      className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${isSelected ? 'ring-2 ring-blue-500 shadow-xl' : ''
        }`}
    >
      {/* Template Preview */}
      <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-40 bg-white shadow-lg rounded-sm overflow-hidden">
            <div className={`h-8 bg-gradient-to-r ${template.color === 'blue' ? 'from-blue-500 to-blue-600' :
              template.color === 'purple' ? 'from-purple-500 to-purple-600' :
                template.color === 'green' ? 'from-green-500 to-green-600' :
                  'from-gray-500 to-gray-600'}`}></div>
            <div className="p-2 space-y-1">
              <div className="h-1 bg-gray-300 rounded w-3/4"></div>
              <div className="h-1 bg-gray-200 rounded w-1/2"></div>
              <div className="h-1 bg-gray-200 rounded w-2/3"></div>
              <div className="mt-2 space-y-0.5">
                <div className="h-0.5 bg-gray-200 rounded"></div>
                <div className="h-0.5 bg-gray-200 rounded w-5/6"></div>
                <div className="h-0.5 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => handleTemplateSelect(template.id)}
              className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <FiCheck className="inline w-4 h-4 mr-1" />
              Select
            </button>
            <button
              onClick={() => handleAddToCompare(template.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              disabled={compareTemplates.length >= 3 || compareTemplates.includes(template.id)}
            >
              <FiEye className="inline w-4 h-4 mr-1" />
              Compare
            </button>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
          </div>
          <button
            onClick={() => handleToggleFavorite(template.id)}
            className={`p-1 rounded ${favorites.includes(template.id) ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
          >
            <FiStar className={`w-4 h-4 ${favorites.includes(template.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Template Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.features.slice(0, 2).map((feature, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
          {template.features.length > 2 && (
            <span className="text-xs text-gray-500">+{template.features.length - 2} more</span>
          )}
        </div>

        {/* Popularity Score */}
        {template.popularityScore && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <FiTrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gray-600">
                {template.popularityScore}% popularity
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${template.category === 'professional' ? 'bg-blue-100 text-blue-700' :
                template.category === 'creative' ? 'bg-purple-100 text-purple-700' :
                  template.category === 'minimal' ? 'bg-gray-100 text-gray-700' :
                    'bg-green-100 text-green-700'
              }`}>
              {template.category}
            </span>
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1">
          <FiCheck className="w-3 h-3" />
        </div>
      )}
    </div>
  )

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Builder</h2>
        <p className="text-gray-600">Choose and customize the perfect template for your resume</p>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 text-sm font-medium py-2 px-4 rounded-md transition-colors ${activeTab === 'templates' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <FiEdit3 className="inline w-4 h-4 mr-2" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('customize')}
            className={`flex-1 text-sm font-medium py-2 px-4 rounded-md transition-colors ${activeTab === 'customize' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            disabled={!selectedTemplateId}
          >
            <FiSettings className="inline w-4 h-4 mr-2" />
            Customize
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex-1 text-sm font-medium py-2 px-4 rounded-md transition-colors ${activeTab === 'compare' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            disabled={compareTemplates.length === 0}
          >
            <FiEye className="inline w-4 h-4 mr-2" />
            Compare ({compareTemplates.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumeTemplates.map(template =>
                renderTemplateCard(template, template.id === selectedTemplateId)
              )}
            </div>
          </div>
        )}

        {/* Customize Tab */}
        {activeTab === 'customize' && selectedTemplate && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customization Panel */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Customize {selectedTemplate.name}</h3>

              {/* Color Scheme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color Scheme</label>
                <div className="grid grid-cols-2 gap-3">
                  {colorSchemes.map(scheme => (
                    <button
                      key={scheme.id}
                      onClick={() => setCustomization({ ...customization, colorScheme: scheme.id })}
                      className={`p-3 rounded-lg border-2 transition-colors ${customization.colorScheme === scheme.id ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {scheme.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                        </div>
                        <span className="text-sm font-medium">{scheme.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
                <div className="flex space-x-3">
                  {['small', 'medium', 'large'].map(size => (
                    <button
                      key={size}
                      onClick={() => setCustomization({ ...customization, fontSize: size as any })}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${customization.fontSize === size
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Spacing</label>
                <div className="flex space-x-3">
                  {['compact', 'normal', 'spacious'].map(spacing => (
                    <button
                      key={spacing}
                      onClick={() => setCustomization({ ...customization, spacing: spacing as any })}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${customization.spacing === spacing
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {spacing}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  <FiDownload className="inline w-4 h-4 mr-2" />
                  Export PDF
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  <FiCopy className="inline w-4 h-4 mr-2" />
                  Duplicate
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Live Preview</h4>
              <div className="bg-white rounded shadow-lg transform scale-75 origin-top-left">
                <TemplateRenderer
                  templateId={selectedTemplateId!}
                  resumeData={resumeData}
                />
              </div>
            </div>
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Template Comparison ({compareTemplates.length}/3)
              </h3>
              <button
                onClick={() => setCompareTemplates([])}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compareTemplates.map(templateId => {
                const template = resumeTemplates.find(t => t.id === templateId)!
                return (
                  <div key={templateId} className="relative">
                    <button
                      onClick={() => handleRemoveFromCompare(templateId)}
                      className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                    {renderTemplateCard(template, templateId === selectedTemplateId)}
                  </div>
                )
              })}
            </div>

            {compareTemplates.length > 0 && (
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-4">Comparison Summary</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="font-medium text-gray-700">Template</div>
                    <div className="font-medium text-gray-700">Category</div>
                    <div className="font-medium text-gray-700">Popularity</div>
                  </div>
                  {compareTemplates.map(templateId => {
                    const template = resumeTemplates.find(t => t.id === templateId)!
                    return (
                      <div key={templateId} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="font-medium">{template.name}</div>
                        <div className="capitalize">{template.category}</div>
                        <div>{template.popularityScore}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateBuilder
