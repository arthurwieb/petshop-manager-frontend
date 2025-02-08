FROM node:latest

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

## COPIA TUDO PRO DOCKER
COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]