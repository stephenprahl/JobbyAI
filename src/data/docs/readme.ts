import { DocumentationFile } from '../../types/documentation.js';

export const readmeDocumentation: DocumentationFile = {
  id: 'readme',
  title: 'JobbyAI',
  description: 'JobbyAI is a modern, full-stack platform for AI-powered resume generation, job analysis, and career management. Built with Bun, Elysia.js, React, Tailwind CSS, and Prisma/PostgreSQL, it offers a seamless experience for job seekers and professionals.',
  version: '1.0.0',
  lastUpdated: '2025-07-13',
  authors: ['JobbyAI Team'],
  tags: ['readme', 'getting-started', 'setup', 'overview'],
  status: 'approved',
  sections: [
    {
      id: 'overview',
      title: 'Project Overview',
      content: 'JobbyAI is a modern, full-stack platform for AI-powered resume generation, job analysis, and career management. Built with Bun, Elysia.js, React, Tailwind CSS, and Prisma/PostgreSQL.',
      type: 'text'
    },
    {
      id: 'project-structure',
      title: 'Project Structure',
      content: `jobbyai/
├── src/
│   ├── client/          # React + Tailwind frontend
│   │   ├── components/  # UI components
│   │   ├── pages/       # App pages (Landing, Docs, Auth, etc.)
│   │   ├── services/    # API and business logic
│   │   ├── contexts/    # React contexts
│   │   └── types/       # TypeScript types
│   └── server/          # Elysia.js backend
│       ├── routes/      # API endpoints
│       ├── services/    # Business logic
│       ├── middleware/  # API middleware
│       └── utils/       # Utilities
├── prisma/              # Prisma schema & migrations
├── public/              # Static assets
// ...existing code...
└── package.json         # Project scripts & dependencies`,
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
        'PostgreSQL 15+ (local or remote)'
      ]
    },
    {
      id: 'installation',
      title: 'Installation & Usage',
      type: 'checklist',
      content: '',
      checklistItems: [
        {
          id: 'install-1',
          text: 'Clone and install dependencies: `git clone <repository-url> && cd jobbyai && bun install`',
          completed: false,
          category: 'setup'
        },
        {
          id: 'install-2',
          text: 'Set up PostgreSQL: Create a local database and update your `.env`',
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
          text: 'Seed the database: `bun run db:seed`',
          completed: false,
          category: 'setup'
        },
        {
          id: 'install-5',
          text: 'Start the dev servers: `bun run dev`',
          completed: false,
          category: 'setup'
        },
        {
          id: 'install-6',
          text: 'Access the app: Frontend: http://localhost:5173, Backend API: http://localhost:3001, Docs: http://localhost:5173/documentation, API Docs: http://localhost:3001/api/docs',
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
        'bun run dev — Start frontend & backend in dev mode',
        'bun run dev:server — Start backend only',
        'bun run dev:client — Start frontend only'
      ]
    },
    {
      id: 'database-scripts',
      title: 'Database Scripts',
      type: 'list',
      content: '',
      items: [
        'bun run db:migrate — Run Prisma migrations',
        'bun run db:seed — Seed the database',
        'bun run db:reset — Reset and reseed database',
        'bun run db:studio — Open Prisma Studio'
      ]
    },
    // ...existing code...
    {
      id: 'configuration',
      title: 'Configuration',
      content: `# Frontend
VITE_API_BASE_URL=http://localhost:3001/api

# Backend
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jobbyai

# CORS
CORS_ORIGIN=http://localhost:5173`,
      type: 'code',
      language: 'env'
    },
    {
      id: 'api-documentation',
      title: 'Documentation & API',
      content: 'Frontend Docs: http://localhost:5173/documentation\nBackend API Docs: http://localhost:3001/api/docs',
      type: 'text',
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
    relatedDocs: ['project-complete', 'migration-complete']
  }
};
