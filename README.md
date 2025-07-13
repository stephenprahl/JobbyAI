# JobbyAI

JobbyAI is a modern, full-stack platform for AI-powered resume generation, job analysis, and career management. Built with Bun, Elysia.js, React, Tailwind CSS, and Prisma/PostgreSQL, it offers a seamless experience for job seekers and professionals.

---

## 🏗️ Project Structure

```bash
jobbyai/
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
└── package.json         # Project scripts & dependencies
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun runtime
- PostgreSQL 15+ (local or remote)

### Installation & Usage

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd jobbyai
   bun install
   ```

2. **Set up PostgreSQL:**
   - Create a local PostgreSQL database (e.g., `jobbyai`)
   - Update your `.env` with the correct `DATABASE_URL`
3. **Run database migrations:**

   ```bash
   bun run db:migrate
   ```

4. **Seed the database:**

   ```bash
   bun run db:seed
   ```

5. **Start the dev servers:**

   ```bash
   bun run dev
   ```

6. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3001](http://localhost:3001)
   - Docs: [http://localhost:5173/documentation](http://localhost:5173/documentation)
   - API Docs: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## 🛠️ Technology Stack

<div align="center">
  <img src="public/vite.svg" alt="Vite" width="40"/>
  <img src="https://raw.githubusercontent.com/stephenprahl/jobbyai/main/public/vite.svg" alt="Vite" width="40"/>
  <img src="https://raw.githubusercontent.com/stephenprahl/jobbyai/main/extension/icons/icon.svg" alt="JobbyAI" width="40"/>
</div>

- **Frontend:** React 18, TypeScript, Tailwind CSS, React Router, React Hook Form
- **Backend:** Bun, Elysia.js, Prisma ORM, Zod, JWT Auth
- **Database:** PostgreSQL 15+
- **Dev Tools:** Vite, Prisma Studio, Prettier, ESLint

---

## 🌟 Features

<div align="center">
  <img src="https://img.shields.io/badge/AI%20Resume%20Builder-✨-blueviolet"/>
  <img src="https://img.shields.io/badge/Job%20Analysis-📊-blue"/>
  <img src="https://img.shields.io/badge/Templates-24%2B-green"/>
  <img src="https://img.shields.io/badge/Direct%20Payments-💳-orange"/>
  <img src="https://img.shields.io/badge/API%20Access-REST-yellow"/>
  <img src="https://img.shields.io/badge/Help%20Center-🆘-red"/>
</div>

- ✨ **AI Resume Builder:** Generate tailored, ATS-friendly resumes in seconds
- 📊 **Job Analysis:** Analyze job postings and optimize your resume
- 🎨 **Template System:** 24+ professional templates, unlocked by plan
- 💳 **Direct Card Payments:** Secure, Stripe-free subscription management
- 👤 **User Profiles:** Manage your info, preferences, and API tokens
- 📄 **API Access:** REST API for programmatic resume and job analysis
- 🆘 **Help Center:** In-app guides, troubleshooting, and support form
- 🔒 **Authentication:** Secure login, registration, and JWT sessions
- 📝 **Documentation:** Modern docs at `/documentation` in the app

---

## 📝 Scripts

- `bun run dev` — Start frontend & backend in dev mode
- `bun run dev:server` — Start backend only
- `bun run dev:client` — Start frontend only
- `bun run build` — Build frontend & backend
- `bun run start` — Start production server
- `bun run preview` — Preview built frontend
- `bun run db:migrate` — Run Prisma migrations
- `bun run db:seed` — Seed the database
- `bun run db:reset` — Reset and reseed database
- `bun run db:studio` — Open Prisma Studio
- `bun run lint` — Lint code
- `bun run format` — Format code
- `bun run clean` — Clean build artifacts

---

## 🔧 Configuration

Environment variables are managed in `.env`:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:3001/api

# Backend
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jobbyai

# CORS
CORS_ORIGIN=http://localhost:5173
```

> 💡 **Tip:** For local development, ensure your PostgreSQL instance is running and accessible. You can use tools like [pgAdmin](https://www.pgadmin.org/) or [TablePlus](https://tableplus.com/) to manage your database visually.

---

## 📚 Documentation & API

- **Frontend Docs:** [http://localhost:5173/documentation](http://localhost:5173/documentation)
- **Backend API Docs:** [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

MIT License
