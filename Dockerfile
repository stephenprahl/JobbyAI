## Use official Bun image
FROM ghcr.io/oven-sh/bun:edge

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json bun.lock ./
COPY tsconfig.json .

# Install dependencies; try a normal install and fall back to --no-lockfile on failure
RUN set -ex; \
	bun install || bun install --no-lockfile || (echo "bun install failed" && exit 1)

# Copy the rest of the source
COPY . .

# Generate Prisma client if schema exists
RUN if [ -f ./prisma/schema.prisma ]; then bunx prisma generate || true; fi

# Build TypeScript artifacts (non-blocking)
RUN bunx tsc || true

# Expose port (Render will supply PORT env but keep default)
EXPOSE 3001

# Use a start script to run migrations then start the server
ENTRYPOINT ["/bin/sh", "./bin/start.sh"]
