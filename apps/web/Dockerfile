FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and lockfile
COPY package.json package-lock.json ./

# Copy the web app
COPY apps/web ./apps/web

# Install all dependencies (this installs for all workspaces but ensures lockfile is respected)
RUN npm ci

# Set working directory to the web app for building
WORKDIR /app/apps/web

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
