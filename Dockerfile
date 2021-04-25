FROM node:14.16.1 AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN npm install -g @nestjs/cli
RUN yarn install

COPY . .

RUN yarn build

CMD ["node", "dist/main"]