import { DocumentationFile } from '../../types/documentation.js';

export const readmeDocumentation: DocumentationFile = {
  id: 'readme',
  title: 'Resume Plan AI',
  description: 'A full-stack application for intelligent resume generation and job analysis, built with Elysia.js backend and React frontend.',
  version: '1.0.0',
  lastUpdated: '2025-07-10',
  authors: ['Resume Plan AI Team'],
  tags: ['readme', 'getting-started', 'setup', 'overview'],
  status: 'approved',
  sections: [
    {
      id: 'overview',
      title: 'Project Overview',
      content: 'A full-stack application for intelligent resume generation and job analysis, built with Elysia.js backend and React frontend.',
      type: 'text'
    },
    {
      id: 'project-structure',
      title: 'Project Structure',
      content: `resume-plan-ai/
├── src/
│   ├── client/          # React frontend
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── contexts/    # React contexts
│   │   └── types/       # TypeScript types
│   └── server/          # Elysia.js backend
│       ├── routes/      # API routes
│       ├── services/    # Business logic
│       ├── middleware/  # Express middleware
│       └── utils/       # Utility functions
├── prisma/              # Database schema and migrations
├── docker-compose.yml   # Docker services
└── package.json         # Unified dependencies`,
      type: 'code',
      language: 'text'
    },
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      type: 'list',
      content: '',
      items: [
        'Node.js 18+',
        'Bun runtime',
        'Docker (for database)'
      ]
    },
    {
      id: 'installation',
      title: 'Installation Steps',
      type: 'checklist',
      content: '',
      checklistItems: [
        {
          id: 'install-1',
          text: 'Clone and install dependencies: `git clone <repository-url> && cd resume-plan-ai && bun install`',
          completed: false,
          category: 'setup'
        },
        {
          id: 'install-2',
          text: 'Start the database: `bun run docker:up`',
          completed: false,
          category: 'setup'
        },
        {
          id: 'install-3',
          text: 'Run database migrations: `bun run db:migrate`',
          completed: false,
          category: 'setup'
        },
        {
          id: 'install-4',
          text: 'Start development servers: `bun run dev`',
          completed: false,
          category: 'setup'
        }
      ]
    },
    {
      id: 'development-scripts',
      title: 'Development Scripts',
      type: 'list',
      content: '',
      items: [
        'bun run dev - Start both frontend and backend',
        'bun run dev:server - Start only backend',
        'bun run dev:client - Start only frontend'
      ]
    },
    {
      id: 'database-scripts',
      title: 'Database Scripts',
      type: 'list',
      content: '',
      items: [
        'bun run db:migrate - Run Prisma migrations',
        'bun run db:seed - Seed the database',
        'bun run db:reset - Reset database and seed',
        'bun run db:studio - Open Prisma Studio'
      ]
    },
    {
      id: 'build-deploy-scripts',
      title: 'Build & Deploy Scripts',
      type: 'list',
      content: '',
      items: [
        'bun run build - Build both frontend and backend',
        'bun run start - Start production server',
        'bun run preview - Preview built frontend'
      ]
    },
    {
      id: 'docker-scripts',
      title: 'Docker Scripts',
      type: 'list',
      content: '',
      items: [
        'bun run docker:up - Start PostgreSQL database',
        'bun run docker:down - Stop all Docker services'
      ]
    },
    {
      id: 'utility-scripts',
      title: 'Utility Scripts',
      type: 'list',
      content: '',
      items: [
        'bun run lint - Lint code',
        'bun run format - Format code with Prettier',
        'bun run clean - Clean build artifacts'
      ]
    },
    {
      id: 'backend-tech-stack',
      title: 'Backend Technology Stack',
      type: 'list',
      content: '',
      items: [
        'Runtime: Bun',
        'Framework: Elysia.js',
        'Database: PostgreSQL with Prisma ORM',
        'Authentication: JWT',
        'Validation: Zod schemas'
      ]
    },
    {
      id: 'frontend-tech-stack',
      title: 'Frontend Technology Stack',
      type: 'list',
      content: '',
      items: [
        'Framework: React 18 with TypeScript',
        'Build Tool: Vite',
        'UI Library: Chakra UI',
        'State Management: React Query',
        'Routing: React Router',
        'Forms: React Hook Form'
      ]
    },
    {
      id: 'infrastructure-tech-stack',
      title: 'Infrastructure Technology Stack',
      type: 'list',
      content: '',
      items: [
        'Database: PostgreSQL (Docker)',
        'Containerization: Docker & Docker Compose',
        'Process Management: Concurrently'
      ]
    },
    {
      id: 'features',
      title: 'Features',
      type: 'list',
      content: '',
      items: [
        'Resume Generation: AI-powered resume creation',
        'Job Analysis: Intelligent job posting analysis',
        'User Authentication: Secure login and registration',
        'Profile Management: User profile and preferences',
        'Real-time Updates: Live development with hot reload'
      ]
    },
    {
      id: 'configuration',
      title: 'Configuration',
      content: `# Frontend
VITE_API_BASE_URL=http://localhost:3001/api

# Backend
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/resume_plan_ai

# CORS
CORS_ORIGIN=http://localhost:5173`,
      type: 'code',
      language: 'env'
    },
    {
      id: 'api-documentation',
      title: 'API Documentation',
      content: 'When running in development, API documentation is available at: http://localhost:3001/api/docs',
      type: 'text'
    },
    {
      id: 'contributing',
      title: 'Contributing',
      type: 'checklist',
      content: '',
      checklistItems: [
        {
          id: 'contrib-1',
          text: 'Fork the repository',
          completed: false,
          category: 'contributing'
        },
        {
          id: 'contrib-2',
          text: 'Create a feature branch',
          completed: false,
          category: 'contributing'
        },
        {
          id: 'contrib-3',
          text: 'Commit your changes',
          completed: false,
          category: 'contributing'
        },
        {
          id: 'contrib-4',
          text: 'Push to the branch',
          completed: false,
          category: 'contributing'
        },
        {
          id: 'contrib-5',
          text: 'Create a Pull Request',
          completed: false,
          category: 'contributing'
        }
      ]
    }
  ],
  metadata: {
    category: 'project-overview',
    importance: 'critical',
    audience: ['developers', 'contributors', 'users'],
    relatedDocs: ['extension-enhancements', 'project-complete', 'migration-complete']
  }
};
