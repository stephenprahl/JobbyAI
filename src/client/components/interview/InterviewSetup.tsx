import React from 'react';
import { FiClock, FiPlay, FiSettings, FiTarget, FiUser } from 'react-icons/fi';

interface InterviewSetupProps {
  onStartInterview: (config: InterviewConfig) => void;
  loading?: boolean;
}

export interface InterviewConfig {
  position: string;
  company: string;
  difficulty: 'entry' | 'mid' | 'senior' | 'executive';
  type: 'behavioral' | 'technical' | 'case' | 'presentation' | 'mixed';
  duration: number;
  industry?: string;
  focusAreas?: string[];
}

const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartInterview, loading = false }) => {
  const [config, setConfig] = React.useState<InterviewConfig>({
    position: '',
    company: '',
    difficulty: 'mid',
    type: 'behavioral',
    duration: 30,
    industry: '',
    focusAreas: []
  });

  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const difficulties = [
    { value: 'entry', label: 'Entry Level', description: 'New graduate or career starter' },
    { value: 'mid', label: 'Mid Level', description: '2-5 years experience' },
    { value: 'senior', label: 'Senior Level', description: '5+ years experience' },
    { value: 'executive', label: 'Executive Level', description: 'Leadership roles' }
  ];

  const interviewTypes = [
    { value: 'behavioral', label: 'Behavioral', description: 'STAR method questions' },
    { value: 'technical', label: 'Technical', description: 'Problem-solving & coding' },
    { value: 'case', label: 'Case Study', description: 'Business scenarios' },
    { value: 'presentation', label: 'Presentation', description: 'Present to panel' },
    { value: 'mixed', label: 'Mixed', description: 'Various question types' }
  ];

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
    'Manufacturing', 'Consulting', 'Media', 'Non-profit', 'Government'
  ];

  const focusAreaOptions = [
    'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
    'Time Management', 'Adaptability', 'Innovation', 'Customer Service',
    'Project Management', 'Technical Skills'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.position.trim() && config.company.trim()) {
      onStartInterview(config);
    }
  };

  const toggleFocusArea = (area: string) => {
    setConfig(prev => ({
      ...prev,
      focusAreas: prev.focusAreas?.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...(prev.focusAreas || []), area]
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
          <FiSettings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Setup Your Interview Practice
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Configure your mock interview session
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FiUser className="inline w-4 h-4 mr-1" />
              Position *
            </label>
            <input
              type="text"
              value={config.position}
              onChange={(e) => setConfig(prev => ({ ...prev, position: e.target.value }))}
              placeholder="e.g., Software Engineer, Product Manager"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company *
            </label>
            <input
              type="text"
              value={config.company}
              onChange={(e) => setConfig(prev => ({ ...prev, company: e.target.value }))}
              placeholder="e.g., Google, Microsoft, Startup Inc."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <FiTarget className="inline w-4 h-4 mr-1" />
            Difficulty Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.value}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, difficulty: difficulty.value as any }))}
                className={`p-4 border-2 rounded-lg text-left transition-all ${config.difficulty === difficulty.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                  }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {difficulty.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {difficulty.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interview Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Interview Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {interviewTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setConfig(prev => ({ ...prev, type: type.value as any }))}
                className={`p-4 border-2 rounded-lg text-left transition-all ${config.type === type.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                  }`}
              >
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {type.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {type.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FiClock className="inline w-4 h-4 mr-1" />
            Interview Duration
          </label>
          <select
            value={config.duration}
            onChange={(e) => setConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={15}>15 minutes (Quick Practice)</option>
            <option value={30}>30 minutes (Standard)</option>
            <option value={45}>45 minutes (Comprehensive)</option>
            <option value={60}>60 minutes (Extended)</option>
          </select>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>

        {/* Advanced Configuration */}
        {showAdvanced && (
          <div className="space-y-6 border-t border-gray-200 dark:border-gray-600 pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry (Optional)
              </label>
              <select
                value={config.industry}
                onChange={(e) => setConfig(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Industry (Optional)</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Focus Areas (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {focusAreaOptions.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${config.focusAreas?.includes(area)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading || !config.position.trim() || !config.company.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 px-6 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : (
              <FiPlay className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Starting Interview...' : 'Start Interview Practice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InterviewSetup;
