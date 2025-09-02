FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm i

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm i --omit=dev
EXPOSE 8080
CMD ["node", "--enable-source-maps", "dist/index.js"]
