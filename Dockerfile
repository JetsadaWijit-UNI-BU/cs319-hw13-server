# --- Stage 1: Builder ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and Prisma schema/config BEFORE npm ci (required for postinstall: prisma generate)
COPY package.json package-lock.json prisma7.config.ts ./
COPY prisma/schema.prisma ./prisma/

# Install all dependencies (including devDependencies for TypeScript compilation)
RUN npm ci

# Copy remaining source code, prisma assets (seed/migrations/meals.json), and static images
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/
COPY images ./images/

# Build TypeScript to JavaScript
RUN npm run build

# --- Stage 2: Production ---
FROM node:22-alpine

WORKDIR /app

# Copy package files and Prisma schema/config BEFORE npm ci
COPY package.json package-lock.json prisma7.config.ts ./
COPY prisma/schema.prisma ./prisma/

# Install all dependencies (prisma CLI and tsx are needed at runtime for migrations/seed)
RUN npm ci

# Copy remaining Prisma files (migrations, seed, meals.json)
COPY prisma ./prisma/

# Copy compiled JavaScript and static images from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/images ./images

# Set production environment
ENV NODE_ENV=production

# Expose application port (adjust if your server uses a different port)
EXPOSE 3000

# Run migrations, seed database, then start the server.
# Requires DATABASE_URL and DIRECT_URL set as Render environment variables.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node dist/server.js"]
