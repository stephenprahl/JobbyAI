## Use official Bun image
FROM node:20-slim

WORKDIR /app

# Install system deps for bun install and build steps
RUN apt-get update && apt-get install -y curl ca-certificates git build-essential python3 unzip && rm -rf /var/lib/apt/lists/*

# Copy package files first to leverage Docker cache
COPY package.json bun.lock ./
COPY tsconfig.json .

# Install Bun via the official install script (avoids pulling GHCR at build time)
RUN set -ex; \
	curl -fsSL https://bun.sh/install | bash -s -- --no-confirm || (echo "bun install script failed" && exit 1); \
	export PATH="/root/.bun/bin:$PATH"; \
	/root/.bun/bin/bun -v

# Ensure bun is on PATH for subsequent RUN commands
ENV PATH="/root/.bun/bin:${PATH}"

# Install dependencies; try a normal install and fall back to --no-lockfile, then to npm ci
RUN set -ex; \
	bun install || bun install --no-lockfile || npm ci

# Copy the rest of the source
COPY . .

# Make sure start script is executable
RUN if [ -f ./bin/start.sh ]; then chmod +x ./bin/start.sh; fi

# Generate Prisma client if schema exists
RUN if [ -f ./prisma/schema.prisma ]; then bunx prisma generate || true; fi

# Build TypeScript artifacts (non-blocking)
RUN bunx tsc || true

# Expose port (Render will supply PORT env but keep default)
EXPOSE 3001

# Use a start script to run migrations then start the server
ENTRYPOINT ["/bin/sh", "./bin/start.sh"]
