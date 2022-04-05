FROM node:16-alpine AS builder

WORKDIR /home/node/app

COPY package.json .
COPY package-lock.json .
COPY webpack.config.ts .
COPY tsconfig.json .

COPY src .

RUN npm ci
RUN npm run build

FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /home/node/app

COPY server.js .

COPY --from=builder /home/node/app/dist .

WORKDIR /home/node/app

USER node

EXPOSE 8080

CMD ["node","server.js"]
