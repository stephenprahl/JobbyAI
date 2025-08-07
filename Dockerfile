# Use the official Bun image
FROM oven/bun:1.2.19

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Expose port
EXPOSE 10000

# Set environment variable for port
ENV PORT=10000

# Start the server
CMD ["bun", "run", "src/server/index.ts"]
