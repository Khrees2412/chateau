# Build image
FROM node:16.13-alpine as builder
WORKDIR /app

COPY package*.json ./
COPY ./prisma prisma
COPY ./src src

RUN yarn install

# Production image

FROM node:16.13-alpine
WORKDIR /app
ENV NODE_ENV production


COPY --chown=node:node --from=builder /app/prisma /app/prisma
COPY --chown=node:node --from=builder /app/src /app/src

USER node

EXPOSE 8080
CMD ["node", "src/index.js"]