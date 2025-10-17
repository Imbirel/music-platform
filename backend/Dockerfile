# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0

# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /app/backend

# Stage 1: Build
FROM base as builder

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM base as production

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production --omit=dev

COPY --from=builder /app/backend/dist ./dist
RUN chown -R node:node /app/backend

USER node

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

EXPOSE 3001

CMD ["node", "dist/main.js"]
