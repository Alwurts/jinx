# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy workspace package files (corrected glob pattern)
COPY jinxify/package*.json ./jinxify/

# Install dependencies for the specific workspace
RUN npm ci --workspace=jinxify --include-workspace-root

# Copy monorepo files
COPY . .

# Build the application
WORKDIR /app/jinxify
RUN npm run build

# Expose the Next.js port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"] 