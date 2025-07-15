import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiArrowRight,
  FiAward,
  FiBarChart,
  FiBook,
  FiCheckCircle,
  FiClock,
  FiGift,
  FiPlay,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  demand: number;
  estimatedLearningTime: string;
  courses: Course[];
  relatedJobs: string[];
}

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  price: string;
  url: string;
  skills: string[];
}

interface CareerGoal {
  id: string;
  title: string;
  targetRole: string;
  company: string;
  deadline: string;
  progress: number;
  milestones: Milestone[];
  requiredSkills: string[];
  status: 'active' | 'completed' | 'paused';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  type: 'skill' | 'certification' | 'experience' | 'networking';
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: string;
  steps: LearningStep[];
  skills: string[];
  outcomes: string[];
}

interface LearningStep {
  id: string;
  title: string;
  type: 'course' | 'project' | 'certification' | 'practice';
  duration: string;
  resources: Course[];
  completed: boolean;
}

export default function CareerDevelopmentPage() {
  const { user, token } = useAuth();
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'skills' | 'learning'>('overview');

  useEffect(() => {
    if (user) {
      fetchCareerData();
    }
  }, [user]);

  const fetchCareerData = async () => {
    try {
      setLoading(true);

      // Simulate API calls for career development data
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock skill gaps data
      setSkillGaps([
        {
          skill: 'TypeScript',
          currentLevel: 2,
          targetLevel: 4,
          demand: 85,
          estimatedLearningTime: '3-4 months',
          courses: [
            {
              id: '1',
              title: 'TypeScript Complete Developer Guide',
              provider: 'Udemy',
              duration: '28 hours',
              difficulty: 'Intermediate',
              rating: 4.6,
              price: '$89.99',
              url: '#',
              skills: ['TypeScript', 'JavaScript', 'React']
            }
          ],
          relatedJobs: ['Senior Frontend Developer', 'Full Stack Engineer']
        },
        {
          skill: 'System Design',
          currentLevel: 1,
          targetLevel: 3,
          demand: 92,
          estimatedLearningTime: '6-8 months',
          courses: [
            {
              id: '2',
              title: 'System Design Interview Prep',
              provider: 'Tech Interview Pro',
              duration: '40 hours',
              difficulty: 'Advanced',
              rating: 4.8,
              price: '$199',
              url: '#',
              skills: ['System Design', 'Architecture', 'Scalability']
            }
          ],
          relatedJobs: ['Senior Software Engineer', 'Tech Lead', 'Principal Engineer']
        }
      ]);

      // Mock career goals
      setCareerGoals([
        {
          id: '1',
          title: 'Become Senior Software Engineer',
          targetRole: 'Senior Software Engineer',
          company: 'FAANG Company',
          deadline: '2025-12-31',
          progress: 65,
          status: 'active',
          requiredSkills: ['TypeScript', 'System Design', 'Leadership', 'Microservices'],
          milestones: [
            {
              id: '1',
              title: 'Complete TypeScript Certification',
              description: 'Get certified in TypeScript fundamentals and advanced concepts',
              completed: true,
              dueDate: '2025-08-15',
              type: 'certification'
            },
            {
              id: '2',
              title: 'Lead a Team Project',
              description: 'Take leadership role in a significant project',
              completed: false,
              dueDate: '2025-10-31',
              type: 'experience'
            }
          ]
        }
      ]);

      // Mock learning paths
      setLearningPaths([
        {
          id: '1',
          title: 'Frontend to Full Stack Developer',
          description: 'Transition from frontend development to full stack with modern technologies',
          estimatedTime: '6-9 months',
          difficulty: 'Intermediate',
          skills: ['Node.js', 'Database Design', 'API Development', 'DevOps'],
          outcomes: ['Build full-stack applications', 'Deploy scalable services', 'Database management'],
          steps: [
            {
              id: '1',
              title: 'Backend Development with Node.js',
              type: 'course',
              duration: '6 weeks',
              completed: false,
              resources: []
            },
            {
              id: '2',
              title: 'Database Design & Management',
              type: 'course',
              duration: '4 weeks',
              completed: false,
              resources: []
            }
          ]
        }
      ]);

    } catch (error) {
      console.error('Error fetching career data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewGoal = () => {
    // Implementation for creating new career goal
    console.log('Creating new career goal...');
  };

  const enrollInPath = (pathId: string) => {
    console.log(`Enrolling in learning path: ${pathId}`);
    // Implementation for enrolling in learning path
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Analyzing your career development opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-primary-500 rounded-xl flex items-center justify-center">
              <FiActivity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Career Development Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                AI-powered career growth and skill development recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FiTrendingUp },
              { id: 'goals', label: 'Career Goals', icon: FiTarget },
              { id: 'skills', label: 'Skill Gaps', icon: FiAward },
              { id: 'learning', label: 'Learning Paths', icon: FiBook }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Career Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FiTarget className="w-8 h-8 text-green-500" />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Active Goals
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your career objectives
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {careerGoals.filter(goal => goal.status === 'active').length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  65% average progress
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FiAward className="w-8 h-8 text-orange-500" />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Skill Gaps
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Areas for improvement
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {skillGaps.length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  High-impact skills identified
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FiBook className="w-8 h-8 text-purple-500" />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Learning Paths
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Curated learning journeys
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {learningPaths.length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personalized recommendations
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recommended Actions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <FiZap className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Start TypeScript Learning Path
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        High demand skill with 85% job market relevance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <FiTarget className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Update Career Goal Timeline
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Review your Senior Engineer goal progress
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Learning Streak
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">7</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Days in a row</p>
                  <div className="flex justify-center space-x-2">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${i < 5
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                      >
                        {i < 5 && <FiCheckCircle className="w-4 h-4" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Career Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Career Goals
              </h2>
              <button
                onClick={createNewGoal}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FiTarget className="w-4 h-4 mr-2" />
                New Goal
              </button>
            </div>

            {careerGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {goal.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {goal.targetRole} at {goal.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {goal.progress}%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Milestones:
                  </h4>
                  {goal.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`flex items-center p-3 rounded-lg ${milestone.completed
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-gray-50 dark:bg-gray-700'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${milestone.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                        {milestone.completed && <FiCheckCircle className="w-3 h-3" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {milestone.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skill Gaps Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Skill Gap Analysis
            </h2>

            {skillGaps.map((gap) => (
              <div
                key={gap.skill}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {gap.skill}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Market demand: {gap.demand}% • Learning time: {gap.estimatedLearningTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Progress needed
                    </div>
                    <div className="text-lg font-bold text-orange-600">
                      {gap.currentLevel}/{gap.targetLevel}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Recommended Courses:
                    </h4>
                    {gap.courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.provider} • {course.duration} • {course.difficulty}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <FiStar className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {course.rating}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-primary-600">
                            {course.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Related Job Opportunities:
                    </h4>
                    <div className="space-y-2">
                      {gap.relatedJobs.map((job, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                        >
                          <FiArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-gray-900 dark:text-white">{job}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Learning Paths Tab */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Personalized Learning Paths
            </h2>

            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {path.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {path.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        {path.estimatedTime}
                      </span>
                      <span className="flex items-center">
                        <FiBarChart className="w-4 h-4 mr-1" />
                        {path.difficulty}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => enrollInPath(path.id)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <FiPlay className="w-4 h-4 mr-2" />
                    Start Path
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Skills You'll Learn:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {path.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Learning Outcomes:
                    </h4>
                    <ul className="space-y-2">
                      {path.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start">
                          <FiGift className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {outcome}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
