# Base image
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Build the application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nuxtjs

# Copy only output and necessary files
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package*.json ./

# Optional: install runtime deps only if needed
RUN npm ci --only=production && npm cache clean --force

# Change ownership
RUN chown -R nuxtjs:nodejs /app
USER nuxtjs

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

