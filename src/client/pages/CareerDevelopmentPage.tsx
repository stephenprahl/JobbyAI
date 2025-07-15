import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiArrowRight,
  FiAward,
  FiBarChart,
  FiBook,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiGift,
  FiGlobe,
  FiLayers,
  FiMapPin,
  FiMessageCircle,
  FiPieChart,
  FiPlay,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUsers,
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

interface SalaryData {
  currentSalary: number;
  targetSalary: number;
  marketAverage: number;
  projectedGrowth: number;
  industryBenchmark: number;
  location: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: 'learning' | 'career' | 'networking' | 'skill';
  points: number;
}

interface NetworkingContact {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  connectionStrength: 'weak' | 'medium' | 'strong';
  lastContact: string;
  potentialValue: string;
  profileUrl?: string;
}

interface IndustryTrend {
  id: string;
  skill: string;
  trend: 'rising' | 'stable' | 'declining';
  demandGrowth: number;
  averageSalary: number;
  jobPostings: number;
  description: string;
}

interface CareerAssessment {
  id: string;
  title: string;
  questions: AssessmentQuestion[];
  completed: boolean;
  score?: number;
  recommendations?: string[];
}

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'rating' | 'text';
  options?: string[];
  answer?: string | number;
}

export default function CareerDevelopmentPage() {
  const { user, token } = useAuth();
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [networkingContacts, setNetworkingContacts] = useState<NetworkingContact[]>([]);
  const [industryTrends, setIndustryTrends] = useState<IndustryTrend[]>([]);
  const [careerAssessment, setCareerAssessment] = useState<CareerAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'skills' | 'learning' | 'salary' | 'networking' | 'trends' | 'assessment'>('overview');

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
            },
            {
              id: '2',
              title: 'Advanced TypeScript Patterns',
              provider: 'Frontend Masters',
              duration: '6 hours',
              difficulty: 'Advanced',
              rating: 4.8,
              price: '$39/month',
              url: '#',
              skills: ['TypeScript', 'Design Patterns', 'Advanced Types']
            }
          ],
          relatedJobs: ['Senior Frontend Developer', 'Full Stack Engineer', 'TypeScript Specialist']
        },
        {
          skill: 'System Design',
          currentLevel: 1,
          targetLevel: 3,
          demand: 92,
          estimatedLearningTime: '6-8 months',
          courses: [
            {
              id: '3',
              title: 'System Design Interview Prep',
              provider: 'Tech Interview Pro',
              duration: '40 hours',
              difficulty: 'Advanced',
              rating: 4.8,
              price: '$199',
              url: '#',
              skills: ['System Design', 'Architecture', 'Scalability']
            },
            {
              id: '4',
              title: 'Designing Data-Intensive Applications',
              provider: 'Coursera',
              duration: '60 hours',
              difficulty: 'Advanced',
              rating: 4.7,
              price: '$49/month',
              url: '#',
              skills: ['Distributed Systems', 'Database Design', 'Microservices']
            }
          ],
          relatedJobs: ['Senior Software Engineer', 'Tech Lead', 'Principal Engineer', 'Solutions Architect']
        },
        {
          skill: 'Leadership & Management',
          currentLevel: 1,
          targetLevel: 3,
          demand: 78,
          estimatedLearningTime: '4-6 months',
          courses: [
            {
              id: '5',
              title: 'Tech Leadership Essentials',
              provider: 'LinkedIn Learning',
              duration: '12 hours',
              difficulty: 'Intermediate',
              rating: 4.5,
              price: '$29.99/month',
              url: '#',
              skills: ['Leadership', 'Team Management', 'Communication']
            },
            {
              id: '6',
              title: 'Engineering Management 101',
              provider: 'Pluralsight',
              duration: '8 hours',
              difficulty: 'Beginner',
              rating: 4.4,
              price: '$35/month',
              url: '#',
              skills: ['People Management', 'Project Management', 'Decision Making']
            }
          ],
          relatedJobs: ['Engineering Manager', 'Tech Lead', 'Team Lead', 'Senior Developer']
        },
        {
          skill: 'Cloud Architecture (AWS)',
          currentLevel: 2,
          targetLevel: 4,
          demand: 89,
          estimatedLearningTime: '5-7 months',
          courses: [
            {
              id: '7',
              title: 'AWS Solutions Architect Professional',
              provider: 'AWS Training',
              duration: '50 hours',
              difficulty: 'Advanced',
              rating: 4.6,
              price: '$300',
              url: '#',
              skills: ['AWS', 'Cloud Architecture', 'DevOps', 'Security']
            },
            {
              id: '8',
              title: 'Complete AWS DevOps Engineer',
              provider: 'A Cloud Guru',
              duration: '35 hours',
              difficulty: 'Intermediate',
              rating: 4.7,
              price: '$47/month',
              url: '#',
              skills: ['AWS', 'CI/CD', 'Infrastructure as Code', 'Monitoring']
            }
          ],
          relatedJobs: ['Cloud Architect', 'DevOps Engineer', 'Senior Backend Engineer', 'Platform Engineer']
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
        },
        {
          id: '2',
          title: 'AI/ML Engineering Path',
          description: 'Master artificial intelligence and machine learning for modern applications',
          estimatedTime: '8-12 months',
          difficulty: 'Advanced',
          skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'MLOps'],
          outcomes: ['Build ML models', 'Deploy AI systems', 'Data analysis expertise'],
          steps: [
            {
              id: '1',
              title: 'Python for Data Science',
              type: 'course',
              duration: '8 weeks',
              completed: false,
              resources: []
            },
            {
              id: '2',
              title: 'Machine Learning Fundamentals',
              type: 'course',
              duration: '10 weeks',
              completed: false,
              resources: []
            },
            {
              id: '3',
              title: 'Deep Learning with TensorFlow',
              type: 'course',
              duration: '12 weeks',
              completed: false,
              resources: []
            }
          ]
        },
        {
          id: '3',
          title: 'Cloud Architecture Mastery',
          description: 'Become proficient in cloud architecture and DevOps practices',
          estimatedTime: '5-7 months',
          difficulty: 'Intermediate',
          skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
          outcomes: ['Design cloud solutions', 'Implement DevOps pipelines', 'Scale applications'],
          steps: [
            {
              id: '1',
              title: 'AWS Fundamentals',
              type: 'certification',
              duration: '4 weeks',
              completed: false,
              resources: []
            },
            {
              id: '2',
              title: 'Docker & Containerization',
              type: 'course',
              duration: '3 weeks',
              completed: false,
              resources: []
            },
            {
              id: '3',
              title: 'Kubernetes Administration',
              type: 'course',
              duration: '6 weeks',
              completed: false,
              resources: []
            }
          ]
        }
      ]);

      // Mock salary data
      setSalaryData({
        currentSalary: 85000,
        targetSalary: 120000,
        marketAverage: 95000,
        projectedGrowth: 15,
        industryBenchmark: 110000,
        location: 'San Francisco, CA'
      });

      // Mock achievements
      setAchievements([
        {
          id: '1',
          title: 'First Learning Path Completed',
          description: 'Successfully completed your first learning path',
          icon: 'book',
          earned: true,
          earnedDate: '2025-06-15',
          category: 'learning',
          points: 100
        },
        {
          id: '2',
          title: 'Skill Gap Champion',
          description: 'Identified and started working on 3+ skill gaps',
          icon: 'target',
          earned: true,
          earnedDate: '2025-07-01',
          category: 'skill',
          points: 150
        },
        {
          id: '3',
          title: 'Network Builder',
          description: 'Connect with 10+ industry professionals',
          icon: 'users',
          earned: false,
          category: 'networking',
          points: 200
        },
        {
          id: '4',
          title: 'Assessment Master',
          description: 'Complete your career development assessment',
          icon: 'award',
          earned: false,
          category: 'career',
          points: 125
        },
        {
          id: '5',
          title: 'Goal Achiever',
          description: 'Complete your first career goal',
          icon: 'trophy',
          earned: false,
          category: 'career',
          points: 300
        },
        {
          id: '6',
          title: 'Learning Streak',
          description: 'Maintain a 30-day learning streak',
          icon: 'zap',
          earned: true,
          earnedDate: '2025-07-10',
          category: 'learning',
          points: 175
        }
      ]);

      // Mock networking contacts
      setNetworkingContacts([
        {
          id: '1',
          name: 'Sarah Chen',
          title: 'Senior Engineering Manager',
          company: 'Google',
          industry: 'Technology',
          connectionStrength: 'medium',
          lastContact: '2025-07-10',
          potentialValue: 'Mentorship & Career Guidance'
        },
        {
          id: '2',
          name: 'Michael Rodriguez',
          title: 'Tech Lead',
          company: 'Meta',
          industry: 'Technology',
          connectionStrength: 'strong',
          lastContact: '2025-07-12',
          potentialValue: 'Technical Skills & Project Collaboration'
        },
        {
          id: '3',
          name: 'Emily Johnson',
          title: 'Principal Software Engineer',
          company: 'Amazon',
          industry: 'Technology',
          connectionStrength: 'medium',
          lastContact: '2025-06-28',
          potentialValue: 'System Design Expertise & Referrals'
        },
        {
          id: '4',
          name: 'David Kim',
          title: 'CTO',
          company: 'Startup Inc',
          industry: 'Technology',
          connectionStrength: 'weak',
          lastContact: '2025-06-15',
          potentialValue: 'Leadership Insights & Startup Opportunities'
        },
        {
          id: '5',
          name: 'Lisa Wang',
          title: 'Senior Data Scientist',
          company: 'Netflix',
          industry: 'Technology',
          connectionStrength: 'strong',
          lastContact: '2025-07-14',
          potentialValue: 'AI/ML Knowledge & Cross-domain Skills'
        }
      ]);

      // Mock industry trends
      setIndustryTrends([
        {
          id: '1',
          skill: 'AI/Machine Learning',
          trend: 'rising',
          demandGrowth: 45,
          averageSalary: 130000,
          jobPostings: 15420,
          description: 'Explosive growth in AI applications across all industries'
        },
        {
          id: '2',
          skill: 'Cloud Architecture',
          trend: 'rising',
          demandGrowth: 32,
          averageSalary: 125000,
          jobPostings: 12850,
          description: 'Continued migration to cloud-native solutions'
        },
        {
          id: '3',
          skill: 'DevOps/Platform Engineering',
          trend: 'stable',
          demandGrowth: 18,
          averageSalary: 115000,
          jobPostings: 8960,
          description: 'Steady demand for infrastructure automation experts'
        }
      ]);

      // Mock career assessment
      setCareerAssessment({
        id: '1',
        title: 'Career Readiness Assessment',
        completed: false,
        questions: [
          {
            id: '1',
            question: 'How would you rate your current technical skills?',
            type: 'rating',
            options: ['1', '2', '3', '4', '5']
          },
          {
            id: '2',
            question: 'What is your primary career goal for the next 2 years?',
            type: 'multiple-choice',
            options: ['Promotion to Senior Level', 'Leadership Role', 'Career Change', 'Start Own Business']
          }
        ]
      });

    } catch (error) {
      console.error('Error fetching career data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewGoal = () => {
    const newGoal: CareerGoal = {
      id: String(careerGoals.length + 1),
      title: 'New Career Goal',
      targetRole: 'Senior Software Engineer',
      company: 'Target Company',
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      status: 'active',
      requiredSkills: ['Leadership', 'Technical Skills'],
      milestones: [
        {
          id: '1',
          title: 'Define specific objectives',
          description: 'Set clear and measurable career objectives',
          completed: false,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: 'skill'
        }
      ]
    };
    setCareerGoals([...careerGoals, newGoal]);
  };

  const enrollInPath = (pathId: string) => {
    console.log(`Enrolling in learning path: ${pathId}`);
    // Update the learning path to show enrollment
    setLearningPaths(paths =>
      paths.map(path =>
        path.id === pathId
          ? { ...path, steps: path.steps.map(step => ({ ...step, completed: false })) }
          : path
      )
    );

    // Show success message (in a real app, this would be a toast notification)
    alert('Successfully enrolled in learning path! Check your progress in the Learning tab.');
  };

  const startAssessment = () => {
    if (careerAssessment) {
      setCareerAssessment({
        ...careerAssessment,
        completed: true,
        score: 85,
        recommendations: [
          'Focus on developing leadership skills to advance to senior roles',
          'Consider obtaining cloud architecture certifications to increase market value',
          'Build a stronger professional network in your target companies',
          'Practice system design skills through mock interviews and projects'
        ]
      });
    }
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setCareerGoals(goals =>
      goals.map(goal =>
        goal.id === goalId
          ? {
            ...goal,
            milestones: goal.milestones.map(milestone =>
              milestone.id === milestoneId
                ? { ...milestone, completed: !milestone.completed }
                : milestone
            ),
            progress: goal.milestones.filter(m =>
              m.id === milestoneId ? !goal.milestones.find(ms => ms.id === milestoneId)?.completed
                : m.completed
            ).length / goal.milestones.length * 100
          }
          : goal
      )
    );
  };

  const messageContact = (contactId: string) => {
    // In a real app, this would open a messaging interface
    const contact = networkingContacts.find(c => c.id === contactId);
    alert(`Message feature would open for ${contact?.name}. This would integrate with LinkedIn, email, or internal messaging.`);
  };

  const scheduleContact = (contactId: string) => {
    // In a real app, this would open calendar scheduling
    const contact = networkingContacts.find(c => c.id === contactId);
    alert(`Calendar scheduling would open for ${contact?.name}. This would integrate with calendar apps.`);
  };

  const addNetworkingContact = () => {
    const newContact: NetworkingContact = {
      id: String(networkingContacts.length + 1),
      name: 'New Contact',
      title: 'Software Engineer',
      company: 'Tech Company',
      industry: 'Technology',
      connectionStrength: 'weak',
      lastContact: new Date().toISOString().split('T')[0],
      potentialValue: 'Industry insights and networking'
    };
    setNetworkingContacts([...networkingContacts, newContact]);
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
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: FiTrendingUp },
              { id: 'goals', label: 'Career Goals', icon: FiTarget },
              { id: 'skills', label: 'Skill Gaps', icon: FiAward },
              { id: 'learning', label: 'Learning Paths', icon: FiBook },
              { id: 'salary', label: 'Salary Tracker', icon: FiDollarSign },
              { id: 'networking', label: 'Networking', icon: FiUsers },
              { id: 'trends', label: 'Industry Trends', icon: FiGlobe },
              { id: 'assessment', label: 'Assessment', icon: FiLayers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  {Math.round(careerGoals.reduce((acc, goal) => acc + goal.progress, 0) / careerGoals.length || 0)}% average progress
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

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FiDollarSign className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Salary Growth
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expected increase
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  +{salaryData?.projectedGrowth || 0}%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on your goals
                </p>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiAward className="w-5 h-5 mr-2 text-yellow-500" />
                Recent Achievements
                <span className="ml-auto text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
                  {achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0)} points earned
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${achievement.earned
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                        }`}>
                        <FiAward className="w-4 h-4" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {achievement.points} points
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recommended Actions
                </h3>
                <div className="space-y-4">
                  <div
                    className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    onClick={() => setActiveTab('learning')}
                  >
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

                  <div
                    className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    onClick={() => setActiveTab('goals')}
                  >
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

                  <div
                    className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    onClick={() => setActiveTab('networking')}
                  >
                    <FiUsers className="w-5 h-5 text-purple-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Expand Professional Network
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect with 5 new industry professionals this month
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
                  </h4>                  {goal.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${milestone.completed
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-gray-50 dark:bg-gray-700'
                        }`}
                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                    >
                      <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center transition-colors ${milestone.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                        }`}>
                        {milestone.completed && <FiCheckCircle className="w-3 h-3" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${milestone.completed
                          ? 'text-green-800 dark:text-green-200 line-through'
                          : 'text-gray-900 dark:text-white'
                          }`}>
                          {milestone.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {milestone.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
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

        {/* Salary Tracker Tab */}
        {activeTab === 'salary' && salaryData && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Salary Growth Tracker
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current vs Target Salary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiDollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Salary Progression
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Current Salary</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${salaryData.currentSalary.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(salaryData.currentSalary / salaryData.targetSalary) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Target Salary</span>
                    <span className="text-xl font-bold text-blue-600">
                      ${salaryData.targetSalary.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Gap to close:</strong> ${(salaryData.targetSalary - salaryData.currentSalary).toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                      <strong>Projected timeline:</strong> 18-24 months with current skill development plan
                    </p>
                  </div>
                </div>
              </div>

              {/* Market Comparison */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiBarChart className="w-5 h-5 mr-2 text-purple-500" />
                  Market Benchmarks
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Market Average</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${salaryData.marketAverage.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Industry Benchmark</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${salaryData.industryBenchmark.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-green-700 dark:text-green-300">Your Position</span>
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      {salaryData.currentSalary > salaryData.marketAverage ? 'Above' : 'Below'} Market
                    </span>
                  </div>

                  <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-purple-800 dark:text-purple-300">
                      <FiMapPin className="w-4 h-4 inline mr-1" />
                      Location: {salaryData.location}
                    </p>
                    <p className="text-sm text-purple-800 dark:text-purple-300 mt-1">
                      Expected growth with skill improvements: <strong>+{salaryData.projectedGrowth}%</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Improvement Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Salary Improvement Strategies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    High-Impact Actions:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <FiZap className="w-4 h-4 text-green-500 mr-3" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Complete TypeScript certification (+$8K potential)
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <FiTarget className="w-4 h-4 text-blue-500 mr-3" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Lead a major project (+$12K potential)
                      </span>
                    </div>
                    <div className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <FiUsers className="w-4 h-4 text-purple-500 mr-3" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Build network in target companies (+$15K potential)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Timeline Milestones:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <FiCalendar className="w-4 h-4 text-yellow-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          6 months: +$5K-8K
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Complete skill certifications
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <FiCalendar className="w-4 h-4 text-orange-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          12 months: +$15K-20K
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Promotion or role transition
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <FiCalendar className="w-4 h-4 text-red-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          24 months: Target achieved
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Senior role at target company
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Networking Tab */}
        {activeTab === 'networking' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Professional Networking
              </h2>
              <button
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                onClick={addNetworkingContact}
              >
                <FiUsers className="w-4 h-4 mr-2" />
                Find Connections
              </button>
            </div>

            {/* Networking Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <FiUsers className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Connections
                  </h3>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {networkingContacts.length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Industry professionals
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <FiMessageCircle className="w-6 h-6 text-green-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Active Conversations
                  </h3>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {networkingContacts.filter(c =>
                    new Date(c.lastContact) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  In the last 30 days
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <FiBriefcase className="w-6 h-6 text-purple-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Referral Potential
                  </h3>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {networkingContacts.filter(c => c.connectionStrength === 'strong').length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Strong connections
                </p>
              </div>
            </div>

            {/* Networking Contacts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Professional Network
              </h3>
              <div className="space-y-4">
                {networkingContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {contact.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {contact.title} at {contact.company}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          <strong>Potential Value:</strong> {contact.potentialValue}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-1 ${contact.connectionStrength === 'strong' ? 'bg-green-500' :
                              contact.connectionStrength === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                            {contact.connectionStrength} connection
                          </span>
                          <span>Last contact: {new Date(contact.lastContact).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                          onClick={() => messageContact(contact.id)}
                        >
                          Message
                        </button>
                        <button
                          className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                          onClick={() => scheduleContact(contact.id)}
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Networking Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Networking Opportunities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Suggested Connections:
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FiUsers className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Engineering Managers at FAANG
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect with senior engineers who can provide mentorship and referrals
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FiGlobe className="w-4 h-4 text-green-500 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Tech Community Leaders
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Engage with thought leaders in TypeScript and system design
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Upcoming Events:
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FiCalendar className="w-4 h-4 text-purple-500 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          React Conf 2025
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        March 15-17 • Great for frontend networking
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center mb-2">
                        <FiCalendar className="w-4 h-4 text-orange-500 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Local Tech Meetup
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Every 2nd Thursday • System Design Focus
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Industry Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Industry Trends & Market Intelligence
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {industryTrends.map((trend) => (
                <div
                  key={trend.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {trend.skill}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${trend.trend === 'rising' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                      trend.trend === 'stable' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' :
                        'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                      }`}>
                      {trend.trend === 'rising' && <FiTrendingUp className="w-3 h-3 inline mr-1" />}
                      {trend.trend.charAt(0).toUpperCase() + trend.trend.slice(1)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Demand Growth</span>
                      <span className="font-semibold text-green-600">+{trend.demandGrowth}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg Salary</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ${trend.averageSalary.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Job Postings</span>
                      <span className="font-semibold text-blue-600">
                        {trend.jobPostings.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {trend.description}
                    </p>
                  </div>

                  <button
                    className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    onClick={() => setActiveTab('learning')}
                  >
                    Explore Learning Path
                  </button>
                </div>
              ))}
            </div>

            {/* Market Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiPieChart className="w-5 h-5 mr-2 text-blue-500" />
                Market Intelligence
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Hot Skills for 2025:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <span className="text-sm text-gray-900 dark:text-white">Generative AI</span>
                      <span className="text-sm font-semibold text-green-600">+67% demand</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <span className="text-sm text-gray-900 dark:text-white">Kubernetes</span>
                      <span className="text-sm font-semibold text-blue-600">+52% demand</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                      <span className="text-sm text-gray-900 dark:text-white">Rust</span>
                      <span className="text-sm font-semibold text-purple-600">+48% demand</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Regional Job Markets:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-900 dark:text-white">San Francisco Bay Area</span>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">24,580 jobs</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-900 dark:text-white">Seattle</span>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">18,920 jobs</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-900 dark:text-white">New York</span>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">16,340 jobs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Career Assessment Tab */}
        {activeTab === 'assessment' && careerAssessment && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Career Development Assessment
            </h2>

            {!careerAssessment.completed ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiLayers className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    {careerAssessment.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Get personalized career recommendations based on your skills, goals, and preferences.
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      10-15 minutes
                    </span>
                    <span className="flex items-center">
                      <FiCheckCircle className="w-4 h-4 mr-1" />
                      {careerAssessment.questions.length} questions
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    What you'll discover:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <FiTarget className="w-4 h-4 text-blue-500 mr-2" />
                        Your career readiness score
                      </li>
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <FiAward className="w-4 h-4 text-green-500 mr-2" />
                        Personalized skill recommendations
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <FiBriefcase className="w-4 h-4 text-purple-500 mr-2" />
                        Optimal career paths
                      </li>
                      <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <FiTrendingUp className="w-4 h-4 text-orange-500 mr-2" />
                        Market positioning insights
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                    onClick={startAssessment}
                  >
                    Start Assessment
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Assessment Complete!
                  </h3>
                  <p className="text-lg font-medium text-green-600">
                    Your Career Readiness Score: {careerAssessment.score || 85}/100
                  </p>
                </div>

                {careerAssessment.recommendations && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Personalized Recommendations:
                    </h4>
                    {careerAssessment.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-gray-800 dark:text-gray-200">{rec}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
