# Docker Setup Instructions

## Development Mode (Recommended)

For development, run only PostgreSQL in Docker and the app locally:

```bash
# Start only PostgreSQL database
docker compose up postgres -d

# Run the development server locally
bun run dev
```

This approach gives you:

- Hot reloading for development
- Faster builds
- Easier debugging
- Full access to logs

## Production Mode

For production deployment, build and run the full stack:

```bash
# Build and run everything
docker compose --profile production up --build

# Or just build the backend image
docker compose build backend
```

## Database Only

If you just need the database:

```bash
# Start PostgreSQL only
docker compose up postgres -d

# Stop the database
docker compose down
```

## Troubleshooting

### Lockfile Issues

If you get lockfile errors during Docker build:

1. Make sure `bun.lock` is up to date: `bun install`
2. The Dockerfile now uses `--production` instead of `--frozen-lockfile`

### Port Conflicts

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3001>
- PostgreSQL: localhost:5432

### Container Management

```bash
# View running containers
docker ps

# View logs
docker compose logs postgres
docker compose logs backend

# Stop all containers
docker compose down

# Remove containers and volumes
docker compose down -v
```
