import React, { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiBarChart,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiFlag,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSearch,
  FiShield,
  FiTrendingUp,
  FiUser,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/auth';
import { JobScam, ReportScamData, ScamStats } from '../shared/types/scamTypes';


const ScamTrackerPage: React.FC = () => {
  const { user } = useAuth()
  const [scams, setScams] = useState<JobScam[]>([])
  const [stats, setStats] = useState<ScamStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedScam, setSelectedScam] = useState<JobScam | null>(null)
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    scamType: '',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false
  })

  const scamTypes = [
    'fake_company',
    'identity_theft',
    'payment_scam',
    'fake_position',
    'pyramid_scheme',
    'data_harvesting',
    'advance_fee_fraud',
    'fake_recruiter'
  ]

  useEffect(() => {
    fetchScams()
    fetchStats()
  }, [filters, pagination.page])

  const fetchScams = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.severity && { severity: filters.severity }),
        ...(filters.scamType && { scamType: filters.scamType })
      })

      const response = await api.get(`/scams?${queryParams}`)

      if (response.data.success) {
        setScams(response.data.data.scams)
        setPagination(prev => ({
          ...prev,
          ...response.data.data.pagination
        }))
      }
    } catch (error) {
      console.error('Error fetching scams:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/scams/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
      case 'MEDIUM': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30'
      case 'HIGH': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
      case 'CRITICAL': return 'text-red-800 bg-red-200 dark:text-red-300 dark:bg-red-900/50'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
      case 'VERIFIED': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      case 'DISMISSED': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
      case 'UNDER_REVIEW': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
    }
  }

  const formatScamType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
                <FiShield className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Job Scam Tracker
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Report and track job posting scams to protect the community
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <FiFlag className="w-5 h-5" />
              <span>Report Scam</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                  <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReports}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Scams</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.verifiedScams}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <FiTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent (30d)</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recentReports}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <FiBarChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Scam Type</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.topScamTypes[0] ? formatScamType(stats.topScamTypes[0].type) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="REPORTED">Reported</option>
                <option value="VERIFIED">Verified</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="DISMISSED">Dismissed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Severities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Scam Type
              </label>
              <select
                value={filters.scamType}
                onChange={(e) => handleFilterChange('scamType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                {scamTypes.map(type => (
                  <option key={type} value={type}>
                    {formatScamType(type)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search companies, titles..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scam List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Reported Scams ({pagination.total})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading scam reports...</p>
            </div>
          ) : scams.length === 0 ? (
            <div className="p-12 text-center">
              <FiShield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No scam reports found</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                Be the first to report a suspicious job posting
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {scams.map((scam) => (
                <div key={scam.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {scam.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(scam.severity)}`}>
                          {scam.severity}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scam.status)}`}>
                          {scam.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{scam.companyName}</span>
                          {scam.location && (
                            <>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <FiMapPin className="w-4 h-4" />
                                <span>{scam.location}</span>
                              </div>
                            </>
                          )}
                          <span>•</span>
                          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                            {formatScamType(scam.scamType)}
                          </span>
                        </div>

                        {scam.description && (
                          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                            {scam.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <FiUser className="w-3 h-3" />
                            <span>Reported by {scam.reportedBy.firstName} {scam.reportedBy.lastName.charAt(0)}.</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiClock className="w-3 h-3" />
                            <span>{new Date(scam.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiAlertTriangle className="w-3 h-3" />
                            <span>{scam.warningCount} warnings issued</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 space-y-2">
                      <button
                        onClick={() => setSelectedScam(scam)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>

                      {scam.url && (
                        <a
                          href={scam.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                        >
                          <span>View Original</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasMore}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Scam Modal */}
      {showReportModal && (
        <ReportScamModal
          onClose={() => setShowReportModal(false)}
          onSuccess={() => {
            setShowReportModal(false)
            fetchScams()
            fetchStats()
          }}
        />
      )}

      {/* Scam Details Modal */}
      {selectedScam && (
        <ScamDetailsModal
          scam={selectedScam}
          onClose={() => setSelectedScam(null)}
        />
      )}
    </div>
  )
}

// Report Scam Modal Component
interface ReportScamModalProps {
  onClose: () => void
  onSuccess: () => void
}

const ReportScamModal: React.FC<ReportScamModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ReportScamData>({
    title: '',
    companyName: '',
    scamType: 'fake_company'
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const scamTypes = [
    { value: 'fake_company', label: 'Fake Company' },
    { value: 'identity_theft', label: 'Identity Theft' },
    { value: 'payment_scam', label: 'Payment Scam' },
    { value: 'fake_position', label: 'Fake Position' },
    { value: 'pyramid_scheme', label: 'Pyramid Scheme' },
    { value: 'data_harvesting', label: 'Data Harvesting' },
    { value: 'advance_fee_fraud', label: 'Advance Fee Fraud' },
    { value: 'fake_recruiter', label: 'Fake Recruiter' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.companyName) {
      setError('Title and company name are required')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const response = await api.post('/scams/report', formData)

      if (response.data.success) {
        onSuccess()
      } else {
        setError(response.data.error || 'Failed to report scam')
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'An error occurred while reporting the scam')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Job Scam</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Software Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Fake Tech Corp"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Scam Type *
              </label>
              <select
                value={formData.scamType}
                onChange={(e) => setFormData(prev => ({ ...prev, scamType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                required
              >
                {scamTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Remote, New York, NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job URL
              </label>
              <input
                type="url"
                value={formData.url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/job"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="scammer@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe the scam details, red flags, what happened..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Any additional information that might help others..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Reporting...' : 'Report Scam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Scam Details Modal Component
interface ScamDetailsModalProps {
  scam: JobScam
  onClose: () => void
}

const ScamDetailsModal: React.FC<ScamDetailsModalProps> = ({ scam, onClose }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
      case 'MEDIUM': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30'
      case 'HIGH': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
      case 'CRITICAL': return 'text-red-800 bg-red-200 dark:text-red-300 dark:bg-red-900/50'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
      case 'VERIFIED': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      case 'DISMISSED': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
      case 'UNDER_REVIEW': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
    }
  }

  const formatScamType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scam Report Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {scam.title}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {scam.companyName}
              </p>
            </div>
            <div className="space-y-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(scam.severity)}`}>
                {scam.severity} Risk
              </span>
              <br />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scam.status)}`}>
                {scam.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Scam Type
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatScamType(scam.scamType)}
                </p>
              </div>

              {scam.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Location
                  </label>
                  <div className="flex items-center space-x-1 text-gray-900 dark:text-white">
                    <FiMapPin className="w-4 h-4" />
                    <span>{scam.location}</span>
                  </div>
                </div>
              )}

              {scam.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Contact Email
                  </label>
                  <div className="flex items-center space-x-1 text-gray-900 dark:text-white">
                    <FiMail className="w-4 h-4" />
                    <span>{scam.email}</span>
                  </div>
                </div>
              )}

              {scam.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center space-x-1 text-gray-900 dark:text-white">
                    <FiPhone className="w-4 h-4" />
                    <span>{scam.phone}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Reported By
                </label>
                <div className="flex items-center space-x-1 text-gray-900 dark:text-white">
                  <FiUser className="w-4 h-4" />
                  <span>{scam.reportedBy.firstName} {scam.reportedBy.lastName.charAt(0)}.</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Report Date
                </label>
                <div className="flex items-center space-x-1 text-gray-900 dark:text-white">
                  <FiClock className="w-4 h-4" />
                  <span>{new Date(scam.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Warnings Issued
                </label>
                <div className="flex items-center space-x-1 text-gray-900 dark:text-white">
                  <FiAlertTriangle className="w-4 h-4" />
                  <span>{scam.warningCount} users warned</span>
                </div>
              </div>

              {scam.verifiedBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Verified By
                  </label>
                  <div className="flex items-center space-x-1 text-gray-900 dark:text-white">
                    <FiCheckCircle className="w-4 h-4 text-green-500" />
                    <span>{scam.verifiedBy.firstName} {scam.verifiedBy.lastName.charAt(0)}. (Admin)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {scam.description && (
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Description
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white leading-relaxed">
                  {scam.description}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {scam.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Additional Notes
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white leading-relaxed">
                  {scam.notes}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {scam.url && (
              <a
                href={scam.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                <span>View Original Post</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScamTrackerPage
