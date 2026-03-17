FROM node:20-slim

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install ALL dependencies (need devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the app (frontend + backend)
RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

# Expose port
EXPOSE 5000

# Set production env
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["node", "dist/index.cjs"]
