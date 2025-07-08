# Resume Plan AI

A full-stack application for intelligent resume generation and job analysis, built with Elysia.js backend and React frontend.

## 🏗️ Project Structure

```
resume-plan-ai/
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
└── package.json         # Unified dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun runtime
- Docker (for database)

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd resume-plan-ai
   bun install
   ```

2. **Start the database:**

   ```bash
   bun run docker:up
   ```

3. **Run database migrations:**

   ```bash
   bun run db:migrate
   ```

4. **Start the development servers:**

   ```bash
   bun run dev
   ```

This starts both:

- **Backend (Elysia.js)**: <http://localhost:3001>
- **Frontend (React/Vite)**: <http://localhost:5173>

## 📝 Available Scripts

### Development

- `bun run dev` - Start both frontend and backend
- `bun run dev:server` - Start only backend
- `bun run dev:client` - Start only frontend

### Database

- `bun run db:migrate` - Run Prisma migrations
- `bun run db:seed` - Seed the database
- `bun run db:reset` - Reset database and seed
- `bun run db:studio` - Open Prisma Studio

### Build & Deploy

- `bun run build` - Build both frontend and backend
- `bun run start` - Start production server
- `bun run preview` - Preview built frontend

### Docker

- `bun run docker:up` - Start PostgreSQL database
- `bun run docker:down` - Stop all Docker services

### Utilities

- `bun run lint` - Lint code
- `bun run format` - Format code with Prettier
- `bun run clean` - Clean build artifacts

## 🛠️ Technology Stack

### Backend (Elysia.js)

- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Validation**: Zod schemas

### Frontend (React)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Chakra UI
- **State Management**: React Query
- **Routing**: React Router
- **Forms**: React Hook Form

### Infrastructure

- **Database**: PostgreSQL (Docker)
- **Containerization**: Docker & Docker Compose
- **Process Management**: Concurrently

## 🌟 Features

- **Resume Generation**: AI-powered resume creation
- **Job Analysis**: Intelligent job posting analysis
- **User Authentication**: Secure login and registration
- **Profile Management**: User profile and preferences
- **Real-time Updates**: Live development with hot reload

## 🔧 Configuration

Environment variables are managed in `.env`:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:3001/api

# Backend
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/resume_plan_ai

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 📚 API Documentation

When running in development, API documentation is available at:
<http://localhost:3001/api/docs>

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
