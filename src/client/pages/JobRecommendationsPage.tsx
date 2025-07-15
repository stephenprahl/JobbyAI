import { useEffect, useState } from 'react';
import {
  FiBookmark,
  FiClock,
  FiDollarSign,
  FiExternalLink,
  FiFilter,
  FiMapPin,
  FiRefreshCw,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
  };
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE';
  postedDate: string;
  matchScore: number;
  matchReasons: string[];
  skillsMatched: string[];
  skillsNeeded: string[];
  description: string;
  requirements: string[];
  benefits?: string[];
  url?: string;
  source: string;
  trending: boolean;
  urgent: boolean;
  recommended: boolean;
}

interface RecommendationFilters {
  minSalary?: number;
  jobTypes: string[];
  locations: string[];
  industries: string[];
  remote: boolean;
  minMatchScore: number;
}

export default function JobRecommendationsPage() {
  const { user, token } = useAuth();
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<RecommendationFilters>({
    jobTypes: [],
    locations: [],
    industries: [],
    remote: false,
    minMatchScore: 50
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user, filters]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filters })
      });

      const data = await response.json();
      if (data.success) {
        setRecommendations(data.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  const saveJob = async (jobId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId })
      });

      const data = await response.json();
      if (data.success) {
        // Update the job as saved in the recommendations
        setRecommendations(prev =>
          prev.map(job =>
            job.id === jobId
              ? { ...job, saved: true }
              : job
          )
        );
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 70) return 'bg-blue-100 dark:bg-blue-900/20';
    if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  if (loading && recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Finding perfect jobs for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <FiStar className="w-8 h-8 text-yellow-500 mr-3" />
              Smart Job Recommendations
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              AI-powered job matches based on your profile and preferences
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filters
            </button>
            <button
              onClick={refreshRecommendations}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Filter Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Match Score
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minMatchScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, minMatchScore: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filters.minMatchScore}% and above
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g., 80000"
                  value={filters.minSalary || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, minSalary: parseInt(e.target.value) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Remote Only
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        <div className="space-y-6">
          {recommendations.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                {/* Job Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {job.title}
                        </h3>
                        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                          {job.company}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 ml-4">
                        {job.trending && (
                          <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-xs font-medium rounded-full">
                            <FiTrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </span>
                        )}
                        {job.urgent && (
                          <span className="inline-flex items-center px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 text-xs font-medium rounded-full">
                            <FiClock className="w-3 h-3 mr-1" />
                            Urgent
                          </span>
                        )}
                        {job.recommended && (
                          <span className="inline-flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full">
                            <FiStar className="w-3 h-3 mr-1" />
                            Recommended
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Job Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <div className="flex items-center">
                        <FiMapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <FiDollarSign className="w-4 h-4 mr-1" />
                          ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                        </div>
                      )}
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        {job.type.replace('_', ' ')}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Posted {new Date(job.postedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="lg:ml-6 mt-4 lg:mt-0">
                    <div className={`inline-flex items-center px-4 py-2 rounded-xl ${getMatchScoreBg(job.matchScore)} ${getMatchScoreColor(job.matchScore)} font-bold text-lg`}>
                      {job.matchScore}% Match
                    </div>
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Why this is a great match:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.matchReasons.slice(0, 3).map((reason, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
                        Your Matching Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skillsMatched.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skillsMatched.length > 4 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{job.skillsMatched.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {job.skillsNeeded.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">
                          Skills to Learn:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skillsNeeded.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description Preview */}
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                    {job.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => saveJob(job.id)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <FiBookmark className="w-4 h-4 mr-2" />
                    Save Job
                  </button>

                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FiExternalLink className="w-4 h-4 mr-2" />
                      View Original
                    </a>
                  )}

                  <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Quick Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Recommendations */}
        {recommendations.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiStar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Recommendations Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Adjust your filters or complete your profile to get better recommendations.
            </p>
            <button
              onClick={refreshRecommendations}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Refresh Recommendations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
