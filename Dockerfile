# # Stage 1: Build the Angular application
# FROM node:lts-alpine AS builder

# # Set the working directory inside the container
# WORKDIR /app

# # Copy project files
# COPY package*.json ./
# COPY angular.json ./
# COPY tsconfig*.json ./
# COPY src ./src

# # Install dependencies
# RUN npm install

# # Build the application for production
# RUN npm run build -- --configuration=production


# # Stage 2: Serve the built application with Nginx
# FROM nginx:alpine

# # Remove default Nginx configuration
# RUN rm /etc/nginx/conf.d/default.conf

# # Copy the built Angular application from the builder stage
# COPY --from=builder /app/dist/Treading /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80 for the Nginx server
# EXPOSE 80

# # Command to start Nginx
# CMD ["nginx", "-g", "daemon off;"]




# FROM node:lts-alpine AS development

# WORKDIR /app

# COPY package*.json ./
# COPY angular.json ./
# COPY tsconfig*.json ./
# COPY src ./src

# RUN npm install

# CMD ["npm", "run", "start"] 
# Assuming you have a "start" script in package.json that runs "ng serve --host 0.0.0.0 --poll 200"










# Stage 1: Build the Angular application
FROM node:lts-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy project files
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./
COPY src ./src

RUN npm install
RUN npm run build --prod

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the built Angular application from the builder stage
COPY --from=builder /app/dist/Treading /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]

