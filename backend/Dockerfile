# Stage 1: Build
FROM node:24 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:24 AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

RUN chown -R node:node /usr/src/app
USER node

EXPOSE 3001
CMD ["node", "dist/main.js"]
