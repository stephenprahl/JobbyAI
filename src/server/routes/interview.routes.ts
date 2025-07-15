const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

interface InterviewQuestion {
  id: string;
  type: 'behavioral' | 'technical' | 'situational' | 'company_specific';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  category: string;
  tips: string[];
  sampleAnswer?: string;
  followUpQuestions?: string[];
}

export const interviewRoutes = new Elysia({ prefix: '/interview' })
  .onRequest(({ request }) => {
    logger.info(`[Interview] ${request.method} ${request.url}`);
  })

  // Start a new interview session
  .post(
    '/start',
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

        // Generate questions based on mode and user profile
        const questions = await generateInterviewQuestions(body.mode, body.jobTitle, body.company);

        // Create interview session (mock implementation)
        const session = {
          id: `session_${Date.now()}`,
          jobTitle: body.jobTitle,
          company: body.company,
          questions,
          responses: [],
          totalDuration: 0,
          averageScore: 0,
          startedAt: new Date().toISOString()
        };

        // In a real implementation, you would save this to the database
        // await prisma.interviewSession.create({ data: session });

        return {
          success: true,
          data: session
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error starting interview session:', errorMessage);
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
        jobTitle: t.String(),
        company: t.String(),
        mode: t.Union([
          t.Literal('quick'),
          t.Literal('comprehensive'),
          t.Literal('custom')
        ])
      })
    }
  )

  // Submit response to a question
  .post(
    '/respond',
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

        // Analyze the response and provide feedback
        const analysis = await analyzeInterviewResponse(
          body.questionId,
          body.response,
          body.duration
        );

        return {
          success: true,
          data: analysis
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error processing interview response:', errorMessage);
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
        sessionId: t.String(),
        questionId: t.String(),
        response: t.String(),
        duration: t.Number()
      })
    }
  )

  // Finish interview session and get feedback
  .post(
    '/finish',
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

        // Generate comprehensive feedback
        const feedback = await generateInterviewFeedback(body.sessionId);

        return {
          success: true,
          data: { feedback }
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error finishing interview session:', errorMessage);
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
        sessionId: t.String()
      })
    }
  )

  // Get interview sessions history
  .get(
    '/sessions',
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

        // Mock interview sessions
        const sessions = [
          {
            id: 'session_1',
            jobTitle: 'Software Engineer',
            company: 'Tech Corp',
            questions: [],
            responses: [],
            totalDuration: 1800, // 30 minutes
            averageScore: 85,
            completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'session_2',
            jobTitle: 'Frontend Developer',
            company: 'StartupXYZ',
            questions: [],
            responses: [],
            totalDuration: 1200, // 20 minutes
            averageScore: 78,
            completedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
          }
        ];

        return {
          success: true,
          data: sessions
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching interview sessions:', errorMessage);
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
  );

// Helper function to generate interview questions
async function generateInterviewQuestions(
  mode: string,
  jobTitle: string,
  company: string
): Promise<InterviewQuestion[]> {
  const questionPool: InterviewQuestion[] = [
    {
      id: '1',
      type: 'behavioral',
      difficulty: 'intermediate',
      question: 'Tell me about a time when you had to overcome a significant challenge at work.',
      category: 'Problem Solving',
      tips: [
        'Use the STAR method (Situation, Task, Action, Result)',
        'Be specific about your role and actions',
        'Focus on what you learned from the experience'
      ],
      sampleAnswer: 'A good answer would include a specific situation, your actions, and the positive outcome...'
    },
    {
      id: '2',
      type: 'technical',
      difficulty: 'intermediate',
      question: 'Explain the difference between let, const, and var in JavaScript.',
      category: 'JavaScript',
      tips: [
        'Discuss scope differences',
        'Mention hoisting behavior',
        'Explain when to use each one'
      ]
    },
    {
      id: '3',
      type: 'situational',
      difficulty: 'beginner',
      question: 'How would you handle a situation where you disagree with your manager\'s technical decision?',
      category: 'Communication',
      tips: [
        'Show respect for hierarchy',
        'Demonstrate constructive communication',
        'Focus on the best outcome for the project'
      ]
    },
    {
      id: '4',
      type: 'company_specific',
      difficulty: 'beginner',
      question: `Why do you want to work at ${company}?`,
      category: 'Company Knowledge',
      tips: [
        'Research the company\'s values and mission',
        'Mention specific products or initiatives',
        'Connect your goals with the company\'s direction'
      ]
    },
    {
      id: '5',
      type: 'technical',
      difficulty: 'advanced',
      question: 'Design a system to handle 1 million concurrent users.',
      category: 'System Design',
      tips: [
        'Start with requirements gathering',
        'Discuss scalability considerations',
        'Consider database and caching strategies'
      ]
    },
    {
      id: '6',
      type: 'behavioral',
      difficulty: 'intermediate',
      question: 'Describe a time when you had to learn a new technology quickly.',
      category: 'Learning Agility',
      tips: [
        'Explain your learning process',
        'Mention resources you used',
        'Describe how you applied the knowledge'
      ]
    },
    {
      id: '7',
      type: 'situational',
      difficulty: 'intermediate',
      question: 'How would you approach debugging a performance issue in a web application?',
      category: 'Problem Solving',
      tips: [
        'Mention systematic approach',
        'Discuss tools and techniques',
        'Consider both frontend and backend factors'
      ]
    }
  ];

  // Select questions based on mode
  let selectedQuestions: InterviewQuestion[];

  switch (mode) {
    case 'quick':
      selectedQuestions = questionPool.slice(0, 5);
      break;
    case 'comprehensive':
      selectedQuestions = questionPool;
      break;
    case 'custom':
      // In a real implementation, this would be based on user preferences
      selectedQuestions = questionPool.filter(q =>
        q.type === 'behavioral' || q.type === 'technical'
      );
      break;
    default:
      selectedQuestions = questionPool.slice(0, 5);
  }

  // Customize questions for the specific job title and company
  return selectedQuestions.map(q => ({
    ...q,
    question: q.question.replace('${company}', company)
  }));
}

// Helper function to analyze interview response
async function analyzeInterviewResponse(
  questionId: string,
  response: string,
  duration: number
): Promise<{ score: number; feedback: string }> {
  // This is a mock implementation. In a real system, you would:
  // 1. Use NLP to analyze the response quality
  // 2. Check for key points and structure
  // 3. Provide specific feedback based on the question type

  // Mock scoring based on response length and duration
  const responseLength = response.length;
  const optimalDuration = 120; // 2 minutes

  let score = 70; // Base score

  // Adjust score based on response length
  if (responseLength > 100) score += 10;
  if (responseLength > 300) score += 10;
  if (responseLength > 500) score += 5;

  // Adjust score based on duration (not too fast, not too slow)
  const durationDiff = Math.abs(duration - optimalDuration);
  if (durationDiff < 30) score += 10;
  else if (durationDiff < 60) score += 5;

  // Cap at 100
  score = Math.min(100, score);

  const feedback = generateResponseFeedback(score, responseLength, duration);

  return { score, feedback };
}

// Helper function to generate response feedback
function generateResponseFeedback(score: number, length: number, duration: number): string {
  let feedback = '';

  if (score >= 90) {
    feedback = 'Excellent response! You provided a comprehensive answer with good structure and timing.';
  } else if (score >= 80) {
    feedback = 'Good response! You covered the main points well.';
  } else if (score >= 70) {
    feedback = 'Decent response, but there\'s room for improvement.';
  } else {
    feedback = 'Your response could be improved significantly.';
  }

  if (length < 100) {
    feedback += ' Consider providing more detail and examples.';
  }

  if (duration < 60) {
    feedback += ' Take more time to think through your answer.';
  } else if (duration > 180) {
    feedback += ' Try to be more concise in your responses.';
  }

  return feedback;
}

// Helper function to generate comprehensive interview feedback
async function generateInterviewFeedback(sessionId: string) {
  // Mock comprehensive feedback
  return {
    overallScore: 82,
    strengths: [
      'Strong technical knowledge demonstrated',
      'Good use of specific examples',
      'Clear communication style',
      'Appropriate response timing'
    ],
    improvements: [
      'Could provide more detailed explanations for complex topics',
      'Consider using the STAR method more consistently',
      'Practice system design questions more',
      'Work on reducing filler words'
    ],
    keyPoints: [
      'You showed excellent problem-solving skills',
      'Your behavioral answers were well-structured',
      'Technical responses demonstrated depth of knowledge',
      'Good enthusiasm for the role and company'
    ],
    recommended_practice: [
      'System Design',
      'Behavioral Questions',
      'Company Research',
      'Technical Communication'
    ]
  };
}
