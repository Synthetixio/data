FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache python3
RUN apk add --no-cache build-base && npm ci && apk del build-base

COPY . .

RUN npm run generate:processor
RUN npm run build

CMD npm run generate:migration ; npm run start
