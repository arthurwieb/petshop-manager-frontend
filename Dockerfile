FROM node:latest

WORKDIR /app

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

## COPIA TUDO PRO DOCKER DEPOIS DE INSTALAR 
COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "dev"]