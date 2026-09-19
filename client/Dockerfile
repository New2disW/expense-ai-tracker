FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose port 5173
EXPOSE 5173

# Start the Vite dev server with --host to bind to all network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
