FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]
