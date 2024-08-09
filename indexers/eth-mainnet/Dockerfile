FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run generate:processor
RUN npm run build

CMD npm run generate:migration ; npm run start
