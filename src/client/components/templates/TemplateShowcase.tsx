import React, { useState } from 'react'
import { FiEye, FiFilter, FiGrid, FiList, FiStar, FiTrendingUp } from 'react-icons/fi'
import { getPopularTemplates, resumeTemplates, templateCategories, type TemplateData } from './ResumeTemplates'
import TemplatePicker from './TemplatePicker'
import TemplatePreviewModal from './TemplatePreviewModal'

interface TemplateShowcaseProps {
  selectedTemplateId?: string
  onTemplateSelect: (templateId: string) => void
  resumeData: any
  className?: string
  showHeader?: boolean
  compactMode?: boolean
}

export const TemplateShowcase: React.FC<TemplateShowcaseProps> = ({
  selectedTemplateId,
  onTemplateSelect,
  resumeData,
  className = '',
  showHeader = true,
  compactMode = false
}) => {
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showStats, setShowStats] = useState(true)

  const popularTemplates = getPopularTemplates(6)
  const categoryStats = templateCategories.map(category => ({
    ...category,
    templates: category.id === 'all' ? resumeTemplates : resumeTemplates.filter(t => t.category === category.id),
    avgPopularity: category.id === 'all'
      ? Math.round(resumeTemplates.reduce((sum, t) => sum + (t.popularityScore || 0), 0) / resumeTemplates.length)
      : Math.round(resumeTemplates.filter(t => t.category === category.id).reduce((sum, t) => sum + (t.popularityScore || 0), 0) / Math.max(1, resumeTemplates.filter(t => t.category === category.id).length))
  }))

  const handleTemplatePreview = (templateId: string) => {
    setPreviewTemplateId(templateId)
  }

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId)
    setPreviewTemplateId(null)
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="text-center space-y-4">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-white tracking-tight">
              Template Gallery
            </h1>
            <div className="absolute -top-2 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold transform rotate-12">
              {resumeTemplates.length} Templates
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose from our professionally designed templates, each crafted for specific industries and career levels
          </p>
        </div>
      )}

      {/* Stats Section */}
      {showStats && !compactMode && (
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {resumeTemplates.length}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Templates
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {templateCategories.length - 1}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Categories
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {popularTemplates.length}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Popular Templates
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                ATS
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Optimized
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Templates Highlight */}
      {!compactMode && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
                <FiStar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Most Popular</h2>
                <p className="text-gray-600 dark:text-gray-400">Top-rated templates by our users</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
              >
                {viewMode === 'grid' ? <FiList className="w-5 h-5" /> : <FiGrid className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplateId === template.id}
                  onSelect={handleTemplateSelect}
                  onPreview={handleTemplatePreview}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {popularTemplates.map((template) => (
                <TemplateListItem
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplateId === template.id}
                  onSelect={handleTemplateSelect}
                  onPreview={handleTemplatePreview}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Statistics */}
      {!compactMode && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
              <FiTrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Category Overview</h2>
              <p className="text-gray-600 dark:text-gray-400">Templates organized by industry and style</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.filter(cat => cat.id !== 'all').map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                    {category.name}
                  </h3>
                  <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-semibold">
                    {category.count}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Avg. Popularity</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{category.avgPopularity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.avgPopularity}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Template Picker */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
            <FiFilter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Templates</h2>
            <p className="text-gray-600 dark:text-gray-400">Browse and filter by category</p>
          </div>
        </div>

        <TemplatePicker
          selectedTemplateId={selectedTemplateId}
          onTemplateSelect={handleTemplateSelect}
          onPreview={handleTemplatePreview}
        />
      </div>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        templateId={previewTemplateId}
        isOpen={!!previewTemplateId}
        onClose={() => setPreviewTemplateId(null)}
        onSelect={handleTemplateSelect}
        selectedTemplateId={selectedTemplateId}
        resumeData={resumeData}
      />
    </div>
  )
}

// Template Card Component
const TemplateCard: React.FC<{
  template: TemplateData
  isSelected: boolean
  onSelect: (id: string) => void
  onPreview: (id: string) => void
}> = ({ template, isSelected, onSelect, onPreview }) => {
  const IconComponent = template.icon
  const isPopular = (template.popularityScore || 0) >= 90

  return (
    <div className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''
      }`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{template.category}</p>
              </div>
            </div>
            {isPopular && (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-lg flex items-center space-x-1">
                <FiStar className="w-3 h-3" />
                <span className="text-xs font-bold">Popular</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {template.description}
          </p>

          <div className="flex space-x-2">
            <button
              onClick={() => onSelect(template.id)}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              {isSelected ? 'Selected' : 'Select'}
            </button>
            <button
              onClick={() => onPreview(template.id)}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors duration-200"
            >
              <FiEye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Template List Item Component
const TemplateListItem: React.FC<{
  template: TemplateData
  isSelected: boolean
  onSelect: (id: string) => void
  onPreview: (id: string) => void
}> = ({ template, isSelected, onSelect, onPreview }) => {
  const IconComponent = template.icon
  const isPopular = (template.popularityScore || 0) >= 90

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 ${isSelected ? 'ring-2 ring-primary-500 border-primary-500' : 'hover:shadow-lg'
      }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg">
            <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{template.name}</h3>
              {isPopular && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-md flex items-center space-x-1">
                  <FiStar className="w-3 h-3" />
                  <span className="text-xs font-bold">Popular</span>
                </div>
              )}
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md text-xs font-medium capitalize">
                {template.category}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{template.description}</p>
            <div className="flex flex-wrap gap-1">
              {template.features.slice(0, 4).map((feature, index) => (
                <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {template.popularityScore && (
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900 dark:text-white">{template.popularityScore}%</div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          )}
          <div className="flex space-x-2">
            <button
              onClick={() => onPreview(template.id)}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors duration-200"
              title="Preview"
            >
              <FiEye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onSelect(template.id)}
              className={`py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${isSelected
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
            >
              {isSelected ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateShowcase
