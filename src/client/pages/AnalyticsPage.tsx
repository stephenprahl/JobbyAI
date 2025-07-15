import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiAward,
  FiBarChart,
  FiClock,
  FiPieChart,
  FiTarget,
  FiTrendingUp
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface AnalyticsData {
  totalApplications: number;
  responseRate: number;
  averageMatchScore: number;
  topSkills: string[];
  applicationTrends: Array<{
    date: string;
    applications: number;
    responses: number;
  }>;
  industryBreakdown: Array<{
    industry: string;
    count: number;
    percentage: number;
  }>;
  salaryInsights: {
    averageOffered: number;
    rangeMin: number;
    rangeMax: number;
    targetRange: string;
  };
  monthlyGoals: {
    applicationsTarget: number;
    currentProgress: number;
    daysLeft: number;
  };
  skillGapAnalysis: Array<{
    skill: string;
    demandScore: number;
    userLevel: number;
    gap: number;
  }>;
}

export default function AnalyticsPage() {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/analytics/dashboard?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Job Search Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Track your progress and optimize your job search strategy
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500 rounded-lg p-3">
                    <FiTarget className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalApplications}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Applications
                </h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500 rounded-lg p-3">
                    <FiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.responseRate}%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Response Rate
                </h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-500 rounded-lg p-3">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.averageMatchScore}%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Avg Match Score
                </h3>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-500 rounded-lg p-3">
                    <FiClock className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.monthlyGoals.daysLeft}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Days Left This Month
                </h3>
              </div>
            </div>

            {/* Application Trends Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <FiBarChart className="w-5 h-5 text-primary-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Application Trends
                  </h3>
                </div>
                <div className="space-y-4">
                  {analytics.applicationTrends.slice(-7).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(trend.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {trend.applications} apps
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {trend.responses} responses
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Goal Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <FiActivity className="w-5 h-5 text-primary-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Monthly Goal Progress
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Applications Goal
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {analytics.monthlyGoals.currentProgress} / {analytics.monthlyGoals.applicationsTarget}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (analytics.monthlyGoals.currentProgress / analytics.monthlyGoals.applicationsTarget) * 100)}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {analytics.monthlyGoals.currentProgress >= analytics.monthlyGoals.applicationsTarget
                      ? "🎉 Goal achieved! Keep up the great work!"
                      : `${analytics.monthlyGoals.applicationsTarget - analytics.monthlyGoals.currentProgress} more applications needed to reach your goal`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Industry Breakdown & Skill Gap Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <FiPieChart className="w-5 h-5 text-primary-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Industry Breakdown
                  </h3>
                </div>
                <div className="space-y-3">
                  {analytics.industryBreakdown.map((industry, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`
                          }}
                        ></div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {industry.industry}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {industry.count}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({industry.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <FiTarget className="w-5 h-5 text-primary-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Skill Gap Analysis
                  </h3>
                </div>
                <div className="space-y-4">
                  {analytics.skillGapAnalysis.slice(0, 5).map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {skill.skill}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${skill.gap > 2
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                            : skill.gap > 1
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                              : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                          }`}>
                          {skill.gap > 2 ? 'High Priority' : skill.gap > 1 ? 'Medium' : 'Good'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Your Level
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(skill.userLevel / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Market Demand
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(skill.demandScore / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Salary Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <FiTrendingUp className="w-5 h-5 text-primary-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Salary Insights
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    ${analytics.salaryInsights.averageOffered.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Average Offered
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    ${analytics.salaryInsights.rangeMin.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Range Minimum
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    ${analytics.salaryInsights.rangeMax.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Range Maximum
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {analytics.salaryInsights.targetRange}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Your Target Range
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
