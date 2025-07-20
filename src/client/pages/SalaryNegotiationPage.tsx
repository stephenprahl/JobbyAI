import { CompensationPackage, MarketData, NegotiationScript, NegotiationTip, SalaryData } from '@/shared/types/salaryTypes';
import { useEffect, useState } from 'react';
import {
  FiAlertTriangle,
  FiAward,
  FiBarChart,
  FiBookOpen,
  FiCheckCircle,
  FiDollarSign,
  FiInfo,
  FiMapPin,
  FiMessageCircle,
  FiTarget,
  FiTrendingUp,
  FiUsers
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';



export default function SalaryNegotiationPage() {
  const { user, token } = useAuth();
  const [salaryData, setSalaryData] = useState<SalaryData>({
    targetSalary: 100000,
    position: 'Software Engineer',
    location: 'San Francisco, CA',
    experience: 3,
    skills: ['React', 'JavaScript', 'Node.js'],
    companySize: 'medium',
    industry: 'Technology'
  });
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [negotiationTips, setNegotiationTips] = useState<NegotiationTip[]>([]);
  const [compensationPackage, setCompensationPackage] = useState<CompensationPackage | null>(null);
  const [negotiationScripts, setNegotiationScripts] = useState<NegotiationScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analysis' | 'tips' | 'scripts' | 'package'>('analysis');

  useEffect(() => {
    if (user) {
      fetchSalaryData();
    }
  }, [user]);

  const fetchSalaryData = async () => {
    try {
      setLoading(true);

      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock market data
      setMarketData({
        percentile25: 85000,
        percentile50: 110000,
        percentile75: 140000,
        percentile90: 170000,
        averageSalary: 118000,
        location: 'San Francisco, CA',
        sampleSize: 1247,
        lastUpdated: '2025-01-01'
      });

      // Mock negotiation tips
      setNegotiationTips([
        {
          id: '1',
          category: 'preparation',
          title: 'Research Market Rates',
          description: 'Gather comprehensive salary data for your role, experience level, and location',
          importance: 'high',
          actionItems: [
            'Use multiple salary comparison sites',
            'Network with professionals in similar roles',
            'Consider total compensation, not just base salary',
            'Factor in cost of living differences'
          ]
        },
        {
          id: '2',
          category: 'strategy',
          title: 'Document Your Achievements',
          description: 'Create a comprehensive list of your contributions and successes',
          importance: 'high',
          actionItems: [
            'Quantify your impact with metrics',
            'List major projects and initiatives',
            'Highlight cost savings or revenue generation',
            'Include recognition and awards received'
          ]
        },
        {
          id: '3',
          category: 'communication',
          title: 'Practice Your Pitch',
          description: 'Rehearse your negotiation conversation to build confidence',
          importance: 'medium',
          actionItems: [
            'Practice with a trusted friend or mentor',
            'Prepare for common objections',
            'Focus on value, not personal needs',
            'Stay professional and positive'
          ]
        },
        {
          id: '4',
          category: 'alternatives',
          title: 'Know Your BATNA',
          description: 'Understand your Best Alternative to a Negotiated Agreement',
          importance: 'high',
          actionItems: [
            'Have other job offers as leverage',
            'Know your walk-away point',
            'Consider non-salary benefits',
            'Evaluate promotion timelines'
          ]
        }
      ]);

      // Mock compensation package analysis
      setCompensationPackage({
        baseSalary: 120000,
        bonus: 15000,
        equity: 25000,
        benefits: {
          healthcare: 8000,
          retirement: 6000,
          vacation: 4000,
          other: 3000
        },
        totalCompensation: 181000
      });

      // Mock negotiation scripts
      setNegotiationScripts([
        {
          scenario: 'Initial Salary Discussion',
          opener: "Thank you for the offer. I'm excited about the opportunity. I've researched market rates for this position, and based on my experience and the value I bring, I was hoping we could discuss the compensation package.",
          keyPoints: [
            'Express enthusiasm for the role',
            'Reference market research',
            'Highlight unique value proposition',
            'Focus on mutual benefit'
          ],
          responses: [
            {
              objection: "This is our standard rate for this level",
              response: "I understand that's your typical range. Given my specific experience with [relevant skills/projects], I believe I can contribute above the standard level. Could we explore a compensation package that reflects this additional value?"
            },
            {
              objection: "The budget is fixed",
              response: "I appreciate the budget constraints. Perhaps we could explore other forms of compensation such as additional vacation time, professional development budget, or equity that might work within the current framework?"
            }
          ],
          closingStatement: "I'm committed to contributing to the team's success. Is there flexibility in the package that would allow us to reach a mutually beneficial agreement?"
        }
      ]);

    } catch (error) {
      console.error('Error fetching salary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentile = (salary: number) => {
    if (!marketData) return 0;

    if (salary <= marketData.percentile25) return 25;
    if (salary <= marketData.percentile50) return 50;
    if (salary <= marketData.percentile75) return 75;
    if (salary <= marketData.percentile90) return 90;
    return 95;
  };

  const getSalaryRecommendation = () => {
    if (!marketData) return null;

    const targetPercentile = calculatePercentile(salaryData.targetSalary);
    const isReasonable = salaryData.targetSalary >= marketData.percentile25 &&
      salaryData.targetSalary <= marketData.percentile90;

    return {
      percentile: targetPercentile,
      isReasonable,
      recommendation: isReasonable
        ? 'Your target salary is within market range'
        : salaryData.targetSalary > marketData.percentile90
          ? 'Your target may be above market rate - ensure you have strong justification'
          : 'Consider raising your target - you may be undervaluing yourself'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Analyzing salary market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Salary Negotiation Assistant
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Data-driven insights and strategies for successful salary negotiations
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'analysis', label: 'Market Analysis', icon: FiBarChart },
              { id: 'tips', label: 'Negotiation Tips', icon: FiTarget },
              { id: 'scripts', label: 'Scripts & Responses', icon: FiMessageCircle },
              { id: 'package', label: 'Total Compensation', icon: FiAward }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Market Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-8">
            {/* Salary Input */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Your Salary Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current/Target Salary
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={salaryData.targetSalary}
                      onChange={(e) => setSalaryData(prev => ({ ...prev, targetSalary: parseInt(e.target.value) }))}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={salaryData.position}
                    onChange={(e) => setSalaryData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={salaryData.experience}
                    onChange={(e) => setSalaryData(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Market Data Visualization */}
            {marketData && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Market Data for {salaryData.position}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <FiMapPin className="inline w-4 h-4 mr-1" />
                    {marketData.location} • {marketData.sampleSize} samples
                  </div>
                </div>

                {/* Salary Range Visualization */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>25th percentile</span>
                    <span>90th percentile</span>
                  </div>
                  <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="absolute h-4 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full"
                      style={{ width: '100%' }}></div>
                    <div
                      className="absolute w-4 h-4 bg-white border-2 border-gray-800 rounded-full -mt-0 transform -translate-x-2"
                      style={{
                        left: `${((salaryData.targetSalary - marketData.percentile25) / (marketData.percentile90 - marketData.percentile25)) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white mt-2">
                    <span>${marketData.percentile25.toLocaleString()}</span>
                    <span>${marketData.percentile90.toLocaleString()}</span>
                  </div>
                </div>

                {/* Percentile Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: '25th Percentile', value: marketData.percentile25 },
                    { label: '50th Percentile', value: marketData.percentile50 },
                    { label: '75th Percentile', value: marketData.percentile75 },
                    { label: '90th Percentile', value: marketData.percentile90 }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${item.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                {getSalaryRecommendation() && (
                  <div className={`mt-6 p-4 rounded-lg ${getSalaryRecommendation()?.isReasonable
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                    }`}>
                    <div className="flex items-center">
                      {getSalaryRecommendation()?.isReasonable ? (
                        <FiCheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <FiAlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                      )}
                      <p className={`font-medium ${getSalaryRecommendation()?.isReasonable
                        ? 'text-green-800 dark:text-green-300'
                        : 'text-yellow-800 dark:text-yellow-300'
                        }`}>
                        Your target salary is at the {getSalaryRecommendation()?.percentile}th percentile
                      </p>
                    </div>
                    <p className={`mt-1 text-sm ${getSalaryRecommendation()?.isReasonable
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-yellow-700 dark:text-yellow-400'
                      }`}>
                      {getSalaryRecommendation()?.recommendation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Negotiation Tips Tab */}
        {activeTab === 'tips' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {negotiationTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${tip.category === 'preparation' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        tip.category === 'strategy' ? 'bg-green-100 dark:bg-green-900/20' :
                          tip.category === 'communication' ? 'bg-purple-100 dark:bg-purple-900/20' :
                            'bg-orange-100 dark:bg-orange-900/20'
                        }`}>
                        {tip.category === 'preparation' && <FiBookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                        {tip.category === 'strategy' && <FiTarget className="w-5 h-5 text-green-600 dark:text-green-400" />}
                        {tip.category === 'communication' && <FiMessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                        {tip.category === 'alternatives' && <FiTrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {tip.category} • {tip.importance} priority
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${tip.importance === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                      tip.importance === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                      {tip.importance}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {tip.description}
                  </p>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Action Items:
                    </h4>
                    <ul className="space-y-2">
                      {tip.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <FiCheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scripts Tab */}
        {activeTab === 'scripts' && (
          <div className="space-y-6">
            {negotiationScripts.map((script, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {script.scenario}
                </h3>

                <div className="space-y-6">
                  {/* Opener */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <FiMessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                      Opening Statement
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-gray-800 dark:text-gray-200 italic">
                        "{script.opener}"
                      </p>
                    </div>
                  </div>

                  {/* Key Points */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <FiTarget className="w-4 h-4 mr-2 text-green-500" />
                      Key Points to Emphasize
                    </h4>
                    <ul className="space-y-2">
                      {script.keyPoints.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start">
                          <FiCheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Responses to Objections */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <FiInfo className="w-4 h-4 mr-2 text-purple-500" />
                      Handling Common Objections
                    </h4>
                    <div className="space-y-4">
                      {script.responses.map((response, responseIndex) => (
                        <div key={responseIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="mb-3">
                            <h5 className="font-medium text-red-600 dark:text-red-400 mb-1">
                              Objection:
                            </h5>
                            <p className="text-gray-700 dark:text-gray-300 italic">
                              "{response.objection}"
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-green-600 dark:text-green-400 mb-1">
                              Your Response:
                            </h5>
                            <p className="text-gray-700 dark:text-gray-300 italic">
                              "{response.response}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Closing */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <FiAward className="w-4 h-4 mr-2 text-orange-500" />
                      Closing Statement
                    </h4>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                      <p className="text-gray-800 dark:text-gray-200 italic">
                        "{script.closingStatement}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Compensation Tab */}
        {activeTab === 'package' && compensationPackage && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Total Compensation Analysis
              </h3>

              {/* Total Compensation Overview */}
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ${compensationPackage.totalCompensation.toLocaleString()}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Total Annual Compensation
                </p>
              </div>

              {/* Compensation Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FiDollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${compensationPackage.baseSalary.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Base Salary
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <FiTrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${compensationPackage.bonus.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Annual Bonus
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <FiAward className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${compensationPackage.equity.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Equity Value
                  </div>
                </div>

                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <FiUsers className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${Object.values(compensationPackage.benefits).reduce((a, b) => a + b, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Benefits Value
                  </div>
                </div>
              </div>

              {/* Benefits Breakdown */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Benefits Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(compensationPackage.benefits).map(([benefit, value]) => (
                    <div key={benefit} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {benefit.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negotiation Opportunities */}
              <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center">
                  <FiInfo className="w-4 h-4 mr-2" />
                  Negotiation Opportunities
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  <li>• If base salary is fixed, focus on bonus potential and equity</li>
                  <li>• Consider negotiating additional vacation time or flexible work arrangements</li>
                  <li>• Ask about professional development budget and conference attendance</li>
                  <li>• Explore sign-on bonus to bridge any gap in expectations</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
