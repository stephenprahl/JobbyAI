const { Elysia, t } = require('elysia');
import { authService } from '../services/auth.service';
import { searchJobs } from '../services/jobSearch.service';
import { chatCompletion } from '../services/ollama';
import prisma from '../services/prisma.service';
import { logger } from '../utils/logger';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: any[];
}

interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface JobApplicationRequest {
  query: string;
  location?: string;
  count?: number;
  jobType?: string;
  experience?: string;
  salary?: {
    min?: number;
    max?: number;
  };
}

interface ResumeCreationRequest {
  jobTitle: string;
  jobDescription?: string;
  companyName?: string;
  templateId?: string;
}

// In-memory storage for chat sessions (replace with database later)
const chatSessions = new Map<string, ChatSession>();

export const chatRoutes = new Elysia({ prefix: '/chat' })
  .onRequest(({ request }) => {
    logger.info(`[Chat] ${request.method} ${request.url}`);
  })

  // Send a message to the AI assistant
  .post(
    '/message',
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

        const { message, sessionId } = body;

        // Get or create chat session
        let session: ChatSession;
        if (sessionId && chatSessions.has(sessionId)) {
          session = chatSessions.get(sessionId)!;
        } else {
          session = {
            id: `session_${Date.now()}`,
            userId: user.id,
            title: generateSessionTitle(message),
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          chatSessions.set(session.id, session);
        }

        // Add user message
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          role: 'user',
          content: message,
          timestamp: new Date()
        };
        session.messages.push(userMessage);

        // Generate AI response
        const aiResponse = await generateAIResponse(message, user, session);

        // Add AI response
        const aiMessage: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date(),
          attachments: aiResponse.attachments || []
        };
        session.messages.push(aiMessage);

        // Update session
        session.updatedAt = new Date();
        chatSessions.set(session.id, session);

        return {
          success: true,
          data: {
            sessionId: session.id,
            message: aiMessage,
            timestamp: new Date()
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error processing chat message:', errorMessage);
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
        message: t.String(),
        sessionId: t.Optional(t.String())
      })
    }
  )

  // Get chat sessions
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

        const userSessions = Array.from(chatSessions.values())
          .filter(session => session.userId === user.id)
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        return {
          success: true,
          data: userSessions
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching chat sessions:', errorMessage);
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

  // Get messages for a specific session
  .get(
    '/sessions/:sessionId/messages',
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

        const session = chatSessions.get(params.sessionId);
        if (!session || session.userId !== user.id) {
          set.status = 404;
          return {
            success: false,
            error: 'Session not found'
          };
        }

        return {
          success: true,
          data: session.messages
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error fetching session messages:', errorMessage);
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
        sessionId: t.String()
      })
    }
  )

  // Apply to jobs automatically
  .post(
    '/apply-jobs',
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

        const { query, location, count = 5, jobType, experience, salary } = body;

        // Search for jobs using the existing job search service
        const searchResults = await searchJobs({
          query,
          location,
          jobType,
          experience,
          salaryMin: salary?.min,
          salaryMax: salary?.max,
          limit: count
        });

        // Get user's resumes
        const userResumes = await prisma.userResume.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        });

        // Prepare job applications
        const applications: any[] = [];
        if (searchResults.jobs && searchResults.jobs.length > 0) {
          for (const job of searchResults.jobs.slice(0, count)) {
            // Select best resume (for now, use the first one)
            const selectedResume = userResumes[0];

            const application = {
              id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              jobTitle: job.title,
              companyName: job.company,
              platform: job.source || 'unknown',
              jobUrl: job.url,
              status: 'pending',
              resumeUsed: selectedResume?.title || 'Default Resume',
              resumeId: selectedResume?.id
            };

            applications.push(application);
          }
        }

        return {
          success: true,
          data: {
            message: `Found ${searchResults.jobs?.length || 0} jobs and prepared ${applications.length} applications`,
            applications: applications,
            jobs: searchResults.jobs || []
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error applying to jobs:', errorMessage);
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
        query: t.String(),
        location: t.Optional(t.String()),
        count: t.Optional(t.Number()),
        jobType: t.Optional(t.String()),
        experience: t.Optional(t.String()),
        salary: t.Optional(t.Object({
          min: t.Optional(t.Number()),
          max: t.Optional(t.Number())
        }))
      })
    }
  )

  // Create a tailored resume
  .post(
    '/create-resume',
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

        const { jobTitle, jobDescription, companyName, templateId } = body;

        // Use existing resume generation API
        const resumeData = {
          jobTitle,
          companyName: companyName || 'Company',
          jobDescription: jobDescription || `${jobTitle} position`,
          requirements: jobDescription ? extractRequirements(jobDescription) : undefined,
          format: 'markdown',
          includeSummary: true,
          includeSkills: true,
          includeExperience: true,
          includeEducation: true,
          includeCertifications: true,
          templateId
        };

        // This would call your existing resume generation service
        // For now, we'll create a simple response
        const resumeContent = `# ${jobTitle} Resume - ${companyName || 'Tailored'}

## Professional Summary
Experienced professional with expertise in ${jobTitle} roles. Skilled in relevant technologies and committed to delivering high-quality results.

## Key Skills
- Technical skills relevant to ${jobTitle}
- Problem-solving and analytical thinking
- Team collaboration and communication
- Project management and organization

## Professional Experience
[Your experience details will be filled in based on your profile]

## Education
[Your education details will be filled in based on your profile]

*This resume has been tailored for the ${jobTitle} position${companyName ? ` at ${companyName}` : ''}.*`;

        // Save the resume using existing API
        const savedResume = await prisma.userResume.create({
          data: {
            userId: user.id,
            title: `${jobTitle} Resume - ${companyName || 'Tailored'}`,
            content: {
              markdown: resumeContent,
              personalInfo: {
                fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                email: user.email,
                phone: '',
                location: ''
              }
            },
            templateId: templateId || null
          }
        });

        return {
          success: true,
          data: {
            resume: savedResume,
            content: resumeContent,
            message: `Created tailored resume for ${jobTitle} position${companyName ? ` at ${companyName}` : ''}`
          }
        };

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        logger.error('Error creating resume:', errorMessage);
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
        jobDescription: t.Optional(t.String()),
        companyName: t.Optional(t.String()),
        templateId: t.Optional(t.String())
      })
    }
  );

// Helper functions
function generateSessionTitle(message: string): string {
  const words = message.split(' ').slice(0, 4).join(' ');
  return words.length > 30 ? words.substring(0, 30) + '...' : words;
}

function extractRequirements(jobDescription: string): string[] {
  const requirements: string[] = [];
  const lines = jobDescription.split('\n');

  for (const line of lines) {
    if (line.includes('require') || line.includes('must have') || line.includes('experience')) {
      requirements.push(line.trim());
    }
  }

  return requirements;
}

async function generateAIResponse(message: string, user: any, session: ChatSession) {
  const input = message.toLowerCase();

  // Resume-related queries
  if (input.includes('resume') || input.includes('cv')) {
    const userResumes = await prisma.userResume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (input.includes('show') || input.includes('list')) {
      return {
        content: `I found ${userResumes.length} resumes in your account:

${userResumes.map((resume, index) => `**${index + 1}. ${resume.title}**
   Created: ${resume.createdAt.toLocaleDateString()}
   Last updated: ${resume.updatedAt.toLocaleDateString()}`).join('\n\n')}

Would you like me to:
• Analyze and optimize any of these resumes?
• Create a new resume for a specific job?
• Generate a tailored version for a particular role?

Just let me know what you need!`,
        attachments: userResumes.map(resume => ({
          type: 'resume',
          id: resume.id,
          title: resume.title,
          data: resume
        }))
      };
    }
  }

  // Job application queries
  if (input.includes('apply') || input.includes('job')) {
    return {
      content: `I can help you apply to jobs automatically! Here's what I can do:

**🎯 Job Search & Application:**
• Search LinkedIn, Indeed, Glassdoor, and other job boards
• Filter by location, salary, experience level, and more
• Apply to multiple positions with tailored resumes
• Track application status and responses

**📋 To get started, tell me:**
• What job titles are you interested in?
• Preferred location (or remote)?
• Salary range?
• Any specific companies?

**Example:** "Apply to 5 software engineer jobs in San Francisco, $120k+, at tech companies"

I'll find matching positions and apply with your best-suited resume for each role!`,
      attachments: []
    };
  }

  // Career advice queries
  if (input.includes('career') || input.includes('advice') || input.includes('skill')) {
    return {
      content: `I'd love to help with your career development! Based on your profile, here's what I can assist with:

**🚀 Career Analysis:**
• Skill gap analysis for your target roles
• Industry trends and market demand
• Salary benchmarking and negotiation tips
• Career path recommendations

**📈 Professional Growth:**
• Identify missing skills and certifications
• Suggest learning resources and courses
• Optimize your LinkedIn profile
• Network building strategies

**💡 Next Steps:**
• Set specific career goals with timelines
• Create action plans for skill development
• Track progress and milestones

What aspect of your career would you like to focus on? I can provide personalized recommendations based on your experience and goals.`,
      attachments: []
    };
  }

  // Interview preparation
  if (input.includes('interview') || input.includes('practice')) {
    return {
      content: `Great! I can help you prepare for interviews. Here's what we can do:

**🎯 Interview Preparation:**
• Practice common interview questions
• Mock technical interviews with coding challenges
• Behavioral question practice with STAR method
• Company-specific interview prep

**📝 Preparation Materials:**
• Create custom question sets for your target role
• Develop compelling stories for behavioral questions
• Practice answers with feedback and improvement tips
• Salary negotiation strategies

**🔄 Practice Sessions:**
• Timed practice rounds
• Video/audio practice with feedback
• Track your improvement over time

Would you like to:
1. Start with common interview questions?
2. Practice for a specific company/role?
3. Work on behavioral questions?
4. Do a mock technical interview?

Let me know what you'd like to focus on!`,
      attachments: []
    };
  }

  // Use AI for other queries
  try {
    const aiResponse = await chatCompletion([
      {
        role: 'system',
        content: 'You are a helpful AI career assistant. You can help with resumes, job applications, career advice, and interview preparation. Be friendly, professional, and provide actionable advice.'
      },
      {
        role: 'user',
        content: message
      }
    ]);

    return {
      content: aiResponse,
      attachments: []
    };
  } catch (error) {
    return {
      content: `I understand you'd like help with "${message}". I can assist you with:

**🎯 Core Services:**
• **Resume Management** - Create, edit, and optimize resumes
• **Job Applications** - Find and apply to positions automatically
• **Career Planning** - Skill analysis and growth recommendations
• **Interview Prep** - Practice questions and mock interviews

**💬 Try asking me:**
• "Show me all my resumes"
• "Apply to 5 marketing jobs in New York"
• "Create a resume for a data scientist role"
• "Help me prepare for a Google interview"

What would you like to focus on?`,
      attachments: []
    };
  }
}

export default chatRoutes;
