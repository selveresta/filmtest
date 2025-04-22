FROM node:slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY types ./types
RUN npm run build

FROM node:slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/db

ARG APP_PORT=8000
ARG SESSION_SECRET

ENV APP_PORT=${APP_PORT} \
    PORT=${APP_PORT} \
    SESSION_SECRET=${SESSION_SECRET}

EXPOSE ${APP_PORT}

CMD ["node", "dist/app.js"]
