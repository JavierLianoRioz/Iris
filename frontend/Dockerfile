FROM node:22-alpine

WORKDIR /app

# Add libc6-compat for esbuild
RUN apk add --no-cache libc6-compat

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

ENV HOST=0.0.0.0
CMD ["pnpm", "run", "dev"]