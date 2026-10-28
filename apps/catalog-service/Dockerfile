FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and lockfile
COPY package.json package-lock.json ./

# Copy the catalog-service app
COPY apps/catalog-service ./apps/catalog-service

# Install dependencies
RUN npm ci

# Set working directory to the catalog-service app
WORKDIR /app/apps/catalog-service

# Generate Prisma client for catalog-service
RUN npx prisma generate

# Expose the port the app runs on (update if index.js uses a different port)
EXPOSE 8001

# Start the application
CMD ["npm", "run", "start"]
