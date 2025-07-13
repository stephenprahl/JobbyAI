import React, { useMemo } from 'react'
import { FiAward, FiBarChart, FiStar, FiTarget, FiTrendingUp, FiUsers } from 'react-icons/fi'
import { resumeTemplates, templateCategories } from './ResumeTemplates'

interface TemplateAnalyticsProps {
  className?: string
}

interface CategoryStats {
  category: string
  templateCount: number
  avgPopularity: number
  topTemplate: string
  totalUsage: number
}

interface TemplateInsight {
  id: string
  title: string
  description: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend: 'up' | 'down' | 'neutral'
  color: string
}

export const TemplateAnalytics: React.FC<TemplateAnalyticsProps> = ({
  className = ''
}) => {
  const analytics = useMemo(() => {
    // Calculate category statistics
    const categoryStats: CategoryStats[] = templateCategories
      .filter(cat => cat.id !== 'all')
      .map(category => {
        const categoryTemplates = resumeTemplates.filter(t => t.category === category.id)
        const avgPopularity = categoryTemplates.length > 0
          ? Math.round(categoryTemplates.reduce((sum, t) => sum + (t.popularityScore || 0), 0) / categoryTemplates.length)
          : 0
        const topTemplate = categoryTemplates.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))[0]

        return {
          category: category.name,
          templateCount: categoryTemplates.length,
          avgPopularity,
          topTemplate: topTemplate?.name || 'N/A',
          totalUsage: categoryTemplates.reduce((sum, t) => sum + (t.popularityScore || 0), 0)
        }
      })
      .sort((a, b) => b.avgPopularity - a.avgPopularity)

    // Calculate insights
    const totalTemplates = resumeTemplates.length
    const avgPopularity = Math.round(resumeTemplates.reduce((sum, t) => sum + (t.popularityScore || 0), 0) / totalTemplates)
    const topTemplate = resumeTemplates.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))[0]
    const mostPopularCategory = categoryStats[0]

    const insights: TemplateInsight[] = [
      {
        id: 'total-templates',
        title: 'Total Templates',
        description: 'Available resume templates',
        value: totalTemplates,
        icon: FiBarChart,
        trend: 'up',
        color: 'blue'
      },
      {
        id: 'avg-popularity',
        title: 'Average Popularity',
        description: 'Across all templates',
        value: `${avgPopularity}%`,
        icon: FiTrendingUp,
        trend: 'up',
        color: 'green'
      },
      {
        id: 'top-template',
        title: 'Most Popular',
        description: topTemplate?.name || 'N/A',
        value: `${topTemplate?.popularityScore || 0}%`,
        icon: FiStar,
        trend: 'up',
        color: 'yellow'
      },
      {
        id: 'top-category',
        title: 'Leading Category',
        description: mostPopularCategory?.category || 'N/A',
        value: `${mostPopularCategory?.avgPopularity || 0}%`,
        icon: FiTarget,
        trend: 'up',
        color: 'purple'
      },
      {
        id: 'professional-usage',
        title: 'Professional Templates',
        description: 'Most used category',
        value: categoryStats.find(c => c.category === 'Professional')?.templateCount || 0,
        icon: FiUsers,
        trend: 'up',
        color: 'indigo'
      },
      {
        id: 'quality-score',
        title: 'Quality Score',
        description: 'Based on features & design',
        value: 'A+',
        icon: FiAward,
        trend: 'up',
        color: 'emerald'
      }
    ]

    return {
      categoryStats,
      insights,
      topTemplate
    }
  }, [])

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
    return colorMap[color] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const getIconColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
      emerald: 'text-emerald-600'
    }
    return colorMap[color] || 'text-gray-600'
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <FiBarChart className="w-6 h-6 mr-3 text-blue-600" />
          Template Analytics
        </h2>
        <p className="text-gray-600">Insights and performance metrics for our resume templates</p>
      </div>

      {/* Key Insights Grid */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {analytics.insights.map(insight => {
            const IconComponent = insight.icon
            return (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border ${getColorClasses(insight.color)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className={`w-6 h-6 ${getIconColorClasses(insight.color)}`} />
                  {insight.trend === 'up' && (
                    <FiTrendingUp className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="text-2xl font-bold mb-1">{insight.value}</div>
                <div className="font-medium mb-1">{insight.title}</div>
                <div className="text-sm opacity-75">{insight.description}</div>
              </div>
            )
          })}
        </div>

        {/* Category Performance */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Rankings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Popularity Rankings</h4>
                <div className="space-y-3">
                  {analytics.categoryStats.slice(0, 5).map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                              index === 2 ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                          }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{category.avgPopularity}%</div>
                        <div className="text-xs text-gray-500">{category.templateCount} templates</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Distribution */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Template Distribution</h4>
                <div className="space-y-2">
                  {analytics.categoryStats.map(category => {
                    const percentage = Math.round((category.templateCount / resumeTemplates.length) * 100)
                    return (
                      <div key={category.category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{category.category}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Template */}
        {analytics.topTemplate && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <FiStar className="w-5 h-5 mr-2 text-yellow-500" />
              Featured Template
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{analytics.topTemplate.name}</h4>
                <p className="text-gray-700 mb-4">{analytics.topTemplate.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {analytics.topTemplate.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <FiTrendingUp className="w-4 h-4 mr-1 text-green-500" />
                    {analytics.topTemplate.popularityScore}% popularity
                  </span>
                  <span className="capitalize bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {analytics.topTemplate.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-48 h-60 bg-white rounded-lg shadow-lg border border-gray-200 relative overflow-hidden">
                  <div className={`h-12 bg-gradient-to-r ${analytics.topTemplate.color === 'blue' ? 'from-blue-500 to-blue-600' :
                      analytics.topTemplate.color === 'purple' ? 'from-purple-500 to-purple-600' :
                        'from-gray-500 to-gray-600'
                    }`}></div>
                  <div className="p-4 space-y-2">
                    <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                    <div className="mt-4 space-y-1">
                      <div className="h-1 bg-gray-200 rounded"></div>
                      <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTarget className="w-5 h-5 mr-2 text-yellow-600" />
            Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Popular Choices</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Professional templates are most requested</li>
                <li>• Creative designs show high engagement</li>
                <li>• Minimal styles are trending upward</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Growth Opportunities</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tech templates could be expanded</li>
                <li>• Healthcare category shows potential</li>
                <li>• Mobile-optimized designs needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateAnalytics
