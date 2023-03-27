FROM node:18-alpine AS builder

WORKDIR /home/node/build

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY webpack.config.ts .
COPY tsconfig.json .
COPY src ./src

RUN npm run build

FROM node:16-alpine

WORKDIR /home/node/app

COPY --from=builder /home/node/build/dist ./www
COPY server.js .

USER node

EXPOSE 8080

ENV NODE_ENV production

CMD ["node","server.js"]
