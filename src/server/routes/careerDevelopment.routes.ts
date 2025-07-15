const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import prisma from '../services/prisma.service';
import { logger } from '../utils/logger';

interface CareerGoal {
  id: string;
  title: string;
  targetRole: string;
  company: string;
  deadline: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  type: 'skill' | 'certification' | 'experience' | 'networking';
}

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

interface LearningPath {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: string;
  skills: string[];
  outcomes: string[];
  steps: LearningStep[];
}

interface LearningStep {
  id: string;
  title: string;
  type: 'course' | 'project' | 'certification' | 'practice';
  duration: string;
  completed: boolean;
}

export const careerDevelopmentRoutes = new Elysia({ prefix: '/career' })
  .onRequest(({ request }) => {
    logger.info(`[CareerDevelopment] ${request.method} ${request.url}`);
  })

  // Get comprehensive career development data
  .get(
    '/dashboard',
    async ({ headers, set }) => {
      try {
        const authHeader = headers.authorization;
        if (!authHeader) {
          set.status = 401;
          return {
            success: false,
            error: 'Authorization header required'
          };
        }

        const token = authHeader.replace('Bearer ', '');
        const user = await authService.getCurrentUser(token);

        // Get user profile and skills for analysis
        const userProfile = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            profile: true,
            skills: {
              include: {
                skill: true
              }
            },
            experiences: true
          }
        });

        if (!userProfile) {
          set.status = 404;
          return {
            success: false,
            error: 'User profile not found'
          };
        }

        // Generate career development recommendations
        const careerData = await generateCareerDevelopmentData(userProfile);

        return {
          success: true,
          data: careerData
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching career development data:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      })
    }
  )

  // Create new career goal
  .post(
    '/goals',
    async ({ body, headers, set }) => {
      try {
        const authHeader = headers.authorization;
        if (!authHeader) {
          set.status = 401;
          return {
            success: false,
            error: 'Authorization header required'
          };
        }

        const token = authHeader.replace('Bearer ', '');
        const user = await authService.getCurrentUser(token);

        // In a real implementation, save to database
        const newGoal = {
          id: `goal_${Date.now()}`,
          userId: user.id,
          ...body,
          createdAt: new Date().toISOString()
        };

        return {
          success: true,
          data: newGoal
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error creating career goal:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      body: t.Object({
        title: t.String(),
        targetRole: t.String(),
        company: t.String(),
        deadline: t.String(),
        description: t.Optional(t.String())
      })
    }
  )

  // Get skill gap analysis
  .get(
    '/skill-gaps',
    async ({ headers, set }) => {
      try {
        const authHeader = headers.authorization;
        if (!authHeader) {
          set.status = 401;
          return {
            success: false,
            error: 'Authorization header required'
          };
        }

        const token = authHeader.replace('Bearer ', '');
        const user = await authService.getCurrentUser(token);

        const skillGaps = await generateSkillGapAnalysis(user.id);

        return {
          success: true,
          data: skillGaps
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching skill gaps:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      })
    }
  )

  // Get learning paths
  .get(
    '/learning-paths',
    async ({ headers, set }) => {
      try {
        const authHeader = headers.authorization;
        if (!authHeader) {
          set.status = 401;
          return {
            success: false,
            error: 'Authorization header required'
          };
        }

        const token = authHeader.replace('Bearer ', '');
        const user = await authService.getCurrentUser(token);

        const learningPaths = await generateLearningPaths(user.id);

        return {
          success: true,
          data: learningPaths
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching learning paths:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      })
    }
  )

  // Enroll in learning path
  .post(
    '/learning-paths/:id/enroll',
    async ({ params, headers, set }) => {
      try {
        const authHeader = headers.authorization;
        if (!authHeader) {
          set.status = 401;
          return {
            success: false,
            error: 'Authorization header required'
          };
        }

        const token = authHeader.replace('Bearer ', '');
        const user = await authService.getCurrentUser(token);

        // In a real implementation, save enrollment to database
        const enrollment = {
          userId: user.id,
          pathId: params.id,
          enrolledAt: new Date().toISOString(),
          progress: 0
        };

        return {
          success: true,
          data: enrollment
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error enrolling in learning path:', errorMessage);
        set.status = 500;
        return {
          success: false,
          error: errorMessage
        };
      }
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      params: t.Object({
        id: t.String()
      })
    }
  );

// Helper function to generate career development data
async function generateCareerDevelopmentData(userProfile: any) {
  const userSkills = userProfile.skills.map((us: any) => us.skill.name);

  // Mock comprehensive career data
  const careerData = {
    overview: {
      activeGoals: 1,
      completedGoals: 0,
      skillGapsIdentified: 2,
      learningPathsAvailable: 3,
      averageGoalProgress: 65,
      learningStreak: 7,
      weeklyLearningTime: 8.5,
      certificationsEarned: 1
    },
    recentActivity: [
      {
        type: 'skill_progress',
        title: 'TypeScript skill improved',
        description: 'Completed advanced TypeScript course',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        icon: 'award'
      },
      {
        type: 'goal_milestone',
        title: 'Career goal milestone reached',
        description: 'Completed leadership training requirement',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        icon: 'target'
      }
    ],
    skillGaps: await generateSkillGapAnalysis(userProfile.id),
    careerGoals: await generateCareerGoals(userProfile.id),
    learningPaths: await generateLearningPaths(userProfile.id),
    recommendations: [
      {
        type: 'skill',
        priority: 'high',
        title: 'Focus on TypeScript',
        description: 'TypeScript is in high demand for your target roles',
        action: 'Start learning path',
        estimatedImpact: 'High'
      },
      {
        type: 'networking',
        priority: 'medium',
        title: 'Connect with senior engineers',
        description: 'Build relationships in your target companies',
        action: 'Join professional groups',
        estimatedImpact: 'Medium'
      }
    ]
  };

  return careerData;
}

// Helper function to generate skill gap analysis
async function generateSkillGapAnalysis(userId: string): Promise<SkillGap[]> {
  // Mock skill gap analysis based on market trends
  return [
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
          url: 'https://udemy.com/typescript-complete',
          skills: ['TypeScript', 'JavaScript', 'React']
        },
        {
          id: '2',
          title: 'Advanced TypeScript Patterns',
          provider: 'Frontend Masters',
          duration: '4 hours',
          difficulty: 'Advanced',
          rating: 4.8,
          price: '$39/month',
          url: 'https://frontendmasters.com/typescript',
          skills: ['TypeScript', 'Design Patterns']
        }
      ],
      relatedJobs: ['Senior Frontend Developer', 'Full Stack Engineer', 'Tech Lead']
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
          provider: 'Educative',
          duration: '40 hours',
          difficulty: 'Advanced',
          rating: 4.7,
          price: '$199',
          url: 'https://educative.io/system-design',
          skills: ['System Design', 'Architecture', 'Scalability']
        }
      ],
      relatedJobs: ['Senior Software Engineer', 'Principal Engineer', 'Tech Lead']
    }
  ];
}

// Helper function to generate career goals
async function generateCareerGoals(userId: string): Promise<CareerGoal[]> {
  return [
    {
      id: '1',
      title: 'Become Senior Software Engineer',
      targetRole: 'Senior Software Engineer',
      company: 'FAANG Company',
      deadline: '2025-12-31',
      progress: 65,
      status: 'active',
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
        },
        {
          id: '3',
          title: 'System Design Study',
          description: 'Master system design principles and patterns',
          completed: false,
          dueDate: '2025-11-30',
          type: 'skill'
        }
      ]
    }
  ];
}

// Helper function to generate learning paths
async function generateLearningPaths(userId: string): Promise<LearningPath[]> {
  return [
    {
      id: '1',
      title: 'Frontend to Full Stack Developer',
      description: 'Transition from frontend development to full stack with modern technologies',
      estimatedTime: '6-9 months',
      difficulty: 'Intermediate',
      skills: ['Node.js', 'Database Design', 'API Development', 'DevOps'],
      outcomes: [
        'Build full-stack applications',
        'Deploy scalable services',
        'Database management',
        'API design and development'
      ],
      steps: [
        {
          id: '1',
          title: 'Backend Development with Node.js',
          type: 'course',
          duration: '6 weeks',
          completed: false
        },
        {
          id: '2',
          title: 'Database Design & Management',
          type: 'course',
          duration: '4 weeks',
          completed: false
        },
        {
          id: '3',
          title: 'Build a Full Stack Project',
          type: 'project',
          duration: '8 weeks',
          completed: false
        },
        {
          id: '4',
          title: 'AWS Deployment Certification',
          type: 'certification',
          duration: '3 weeks',
          completed: false
        }
      ]
    },
    {
      id: '2',
      title: 'Senior Engineer Leadership Track',
      description: 'Develop technical leadership and management skills for senior roles',
      estimatedTime: '4-6 months',
      difficulty: 'Advanced',
      skills: ['Technical Leadership', 'System Design', 'Team Management', 'Architecture'],
      outcomes: [
        'Lead technical teams',
        'Design scalable systems',
        'Mentor junior developers',
        'Drive technical decisions'
      ],
      steps: [
        {
          id: '1',
          title: 'System Design Mastery',
          type: 'course',
          duration: '8 weeks',
          completed: false
        },
        {
          id: '2',
          title: 'Technical Leadership Skills',
          type: 'course',
          duration: '4 weeks',
          completed: false
        },
        {
          id: '3',
          title: 'Mentor a Junior Developer',
          type: 'practice',
          duration: '12 weeks',
          completed: false
        }
      ]
    }
  ];
}
