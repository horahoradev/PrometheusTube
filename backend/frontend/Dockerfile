FROM node:21-alpine3.17

COPY . .

RUN npm install

RUN npm run build

ENTRYPOINT npm run start
