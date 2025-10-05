FROM node:22-alpine AS base
WORKDIR /app

# Install deps (cache)
COPY ./package.json ./package-lock.json* ./ 
RUN npm ci --legacy-peer-deps

# Copy everything (source will be mounted in compose for dev)
COPY . .

# default command for development:
# ensure VITE binds to 0.0.0.0 in package.json start script or via env
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]