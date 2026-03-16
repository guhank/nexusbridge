FROM node:20-slim

WORKDIR /app

# Copy built output
COPY dist/ ./dist/
COPY package.json ./

# Install production dependencies only
RUN npm install --production --ignore-scripts

# Expose port
EXPOSE 5000

# Set production env
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["node", "dist/index.cjs"]
