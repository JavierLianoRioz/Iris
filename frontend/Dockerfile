# Use an official Bun base image
FROM oven/bun:1.0.9 as build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the frontend code
COPY . .

# Build the React app
RUN bun run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy the build output to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
