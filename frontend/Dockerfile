FROM node:20-alpine

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/index.html ./
COPY frontend/vite.config.js ./
COPY frontend/.env.example ./.env

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g http-server

COPY --from=0 /app/frontend/dist ./dist

EXPOSE 3000

CMD ["http-server", "dist", "-p", "3000", "--cors"]
