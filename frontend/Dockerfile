FROM node:18-alpine

WORKDIR /app

# Add libc6-compat for esbuild
RUN apk add --no-cache libc6-compat

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 4321

CMD ["pnpm", "run", "dev", "--host"]