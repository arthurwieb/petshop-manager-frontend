FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install 

## COPIA TUDO PRO DOCKER DEPOIS DE INSTALAR 
COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "dev"]