# Stage 1: Build TypeScript & generate Prisma Client
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma configuration, schema, and source code
COPY prisma7.config.ts tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma 7 client
RUN npx prisma generate --config prisma7.config.ts

# Compile TypeScript to dist/
RUN npm run build

# Stage 2: Production runtime
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy Prisma files and generated client from builder
COPY prisma7.config.ts ./
COPY prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled JavaScript and static meal images
COPY --from=builder /app/dist ./dist
COPY images ./images

EXPOSE 3000

# Run migrations (optional at startup) and start the Express server
CMD ["sh", "-c", "npx prisma migrate deploy --config prisma7.config.ts && node dist/server.js"]
