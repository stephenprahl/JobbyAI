import React from 'react'
import { FiCheck, FiDownload, FiEye, FiInfo, FiTrendingUp, FiX } from 'react-icons/fi'
import { getBestForList, getTemplateById } from './ResumeTemplates'
import TemplatePreview from './TemplatePreview'

interface TemplatePreviewModalProps {
  templateId: string | null
  isOpen: boolean
  onClose: () => void
  onSelect: (templateId: string) => void
  selectedTemplateId?: string
  resumeData: any
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  templateId,
  isOpen,
  onClose,
  onSelect,
  selectedTemplateId,
  resumeData
}) => {
  if (!isOpen || !templateId) return null

  const template = getTemplateById(templateId)
  if (!template) return null

  const isSelected = selectedTemplateId === templateId

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-primary-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <template.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {template.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 capitalize">
                  {template.category} • Template Preview
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Selection Status */}
              {isSelected && (
                <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg">
                  <FiCheck className="w-5 h-5" />
                  <span className="font-semibold">Currently Selected</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {!isSelected && (
                  <button
                    onClick={() => {
                      onSelect(templateId)
                      onClose()
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <FiCheck className="w-5 h-5" />
                    <span>Use This Template</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-3 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-full">
            {/* Template Info Sidebar */}
            <div className="w-80 p-6 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
              <div className="space-y-6">
                {/* Template Stats */}
                {template.popularityScore && (
                  <div className="bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-500 p-2 rounded-lg">
                        <FiTrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                          {template.popularityScore}%
                        </div>
                        <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                          Popularity Score
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <FiInfo className="w-4 h-4" />
                    <span>About This Template</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Features</h3>
                  <div className="space-y-2">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                {template.bestFor && template.bestFor.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">Best For</h3>
                    <div className="space-y-2">
                      {template.bestFor.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* General Category Best For */}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Industry Focus</h3>
                  <div className="space-y-2">
                    {getBestForList(template.category).map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-secondary-500 rounded-full flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview Note */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Template Preview</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 italic leading-relaxed">
                    {template.preview}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  {!isSelected ? (
                    <button
                      onClick={() => {
                        onSelect(templateId)
                        onClose()
                      }}
                      className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <FiCheck className="w-5 h-5" />
                      <span>Select Template</span>
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <FiCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-green-700 dark:text-green-300 font-semibold">
                          This is your current template
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Download Preview Button */}
                  <button
                    onClick={() => {
                      // TODO: Implement download preview functionality
                      console.log('Download preview for:', templateId)
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download Preview</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
              <div className="p-6">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-700">Live Preview</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FiEye className="w-4 h-4" />
                        <span>Sample Data</span>
                      </div>
                    </div>
                  </div>
                  <TemplatePreview
                    template={template}
                    resumeData={resumeData}
                    className="transform scale-75 origin-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplatePreviewModal
