import React, { useState } from 'react'
import { FiCheck, FiEye, FiFilter, FiSearch, FiStar, FiTrendingUp } from 'react-icons/fi'
import { getPopularTemplates, getTemplatesByCategory, resumeTemplates, templateCategories, type TemplateData } from './ResumeTemplates'

interface TemplatePickerProps {
  selectedTemplateId?: string
  onTemplateSelect: (templateId: string) => void
  onPreview?: (templateId: string) => void
  className?: string
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  indigo: 'from-indigo-500 to-indigo-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  rose: 'from-rose-500 to-rose-600',
  gray: 'from-gray-500 to-gray-600',
  slate: 'from-slate-500 to-slate-600',
  stone: 'from-stone-500 to-stone-600',
  emerald: 'from-emerald-500 to-emerald-600',
  teal: 'from-teal-500 to-teal-600',
  green: 'from-green-500 to-green-600',
  amber: 'from-amber-500 to-amber-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
  violet: 'from-violet-500 to-violet-600'
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectedTemplateId,
  onTemplateSelect,
  onPreview,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPopularOnly, setShowPopularOnly] = useState(false)

  const filteredTemplates = React.useMemo(() => {
    let templates = selectedCategory === 'all'
      ? resumeTemplates
      : getTemplatesByCategory(selectedCategory)

    // Apply search filter
    if (searchQuery.trim()) {
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (template.bestFor && template.bestFor.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    }

    // Apply popularity filter
    if (showPopularOnly) {
      templates = templates.filter(template => (template.popularityScore || 0) >= 85)
    }

    return templates
  }, [selectedCategory, searchQuery, showPopularOnly])

  const popularTemplates = getPopularTemplates(3)

  const renderTemplateCard = (template: TemplateData) => {
    const isSelected = selectedTemplateId === template.id
    const isHovered = hoveredTemplate === template.id
    const IconComponent = template.icon
    const gradientClass = colorClasses[template.color as keyof typeof colorClasses] || colorClasses.blue
    const isPopular = (template.popularityScore || 0) >= 90

    return (
      <div
        key={template.id}
        className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900' : ''
          }`}
        onMouseEnter={() => setHoveredTemplate(template.id)}
        onMouseLeave={() => setHoveredTemplate(null)}
        onClick={() => onTemplateSelect(template.id)}
      >
        {/* Template Card */}
        <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 overflow-hidden ${isSelected
            ? 'border-primary-500 shadow-xl'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl'
          }`}>

          {/* Header with Gradient */}
          <div className={`relative h-28 bg-gradient-to-r ${gradientClass} p-4`}>
            <div className="flex items-center justify-between text-white h-full">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{template.name}</h3>
                  <p className="text-xs opacity-90 capitalize">{template.category}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-col items-end space-y-1">
                {isPopular && (
                  <div className="bg-yellow-500 text-white p-1 rounded-md flex items-center space-x-1">
                    <FiStar className="w-3 h-3" />
                    <span className="text-xs font-bold">Popular</span>
                  </div>
                )}
                {template.popularityScore && (
                  <div className="bg-white/20 p-1 rounded-md">
                    <span className="text-xs font-semibold">{template.popularityScore}%</span>
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-white/20 p-1 rounded-full backdrop-blur-sm">
                  <FiCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-2 right-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-2 left-4 w-8 h-8 bg-white/10 rounded-full blur-lg"></div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
              {template.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-1">
              {template.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium"
                >
                  {feature}
                </span>
              ))}
              {template.features.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full font-medium">
                  +{template.features.length - 3}
                </span>
              )}
            </div>

            {/* Best For */}
            {template.bestFor && template.bestFor.length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">Best for:</span> {template.bestFor.slice(0, 2).join(', ')}
                {template.bestFor.length > 2 && '...'}
              </div>
            )}

            {/* Preview Text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2">
              {template.preview}
            </p>
          </div>

          {/* Hover Actions */}
          {(isHovered || isSelected) && onPreview && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPreview(template.id)
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg backdrop-blur-sm transition-colors duration-200"
                  title="Preview Template"
                >
                  <FiEye className="w-5 h-5" />
                </button>
                {/* Popular Badge on Hover */}
                {isPopular && (
                  <div className="bg-yellow-500 text-white p-2 rounded-lg flex items-center space-x-1">
                    <FiStar className="w-4 h-4" />
                    <span className="text-xs font-bold">Popular</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-gray-950 dark:text-white tracking-tight">
          Choose Your Template
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Select a professionally designed template that matches your industry and personal style
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPopularOnly(!showPopularOnly)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${showPopularOnly
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <FiTrendingUp className="w-4 h-4" />
            <span>Popular</span>
          </button>
        </div>
      </div>

      {/* Popular Templates Section */}
      {selectedCategory === 'all' && !searchQuery && !showPopularOnly && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
              <FiStar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Most Popular</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTemplates.map(renderTemplateCard)}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {templateCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${selectedCategory === category.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <span>{category.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.id
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="space-y-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFilter className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No templates found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            {selectedCategory !== 'all' && !showPopularOnly && (
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                  {selectedCategory} Templates
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map(renderTemplateCard)}
            </div>
          </>
        )}
      </div>

      {/* Selected Template Info */}
      {selectedTemplateId && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-green-900 dark:text-green-100">
                Template Selected
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                {resumeTemplates.find(t => t.id === selectedTemplateId)?.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplatePicker
