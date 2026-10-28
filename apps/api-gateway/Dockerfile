FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and lockfile
COPY package.json package-lock.json ./

# Copy the api-gateway app
COPY apps/api-gateway ./apps/api-gateway

# Install dependencies
RUN npm ci

# Set working directory to the api-gateway app
WORKDIR /app/apps/api-gateway

# Expose the port the app runs on (update if index.js uses a different port)
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start"]
