FROM node:21-alpine3.17

COPY . .

RUN npm install --force

RUN npm run build

ENTRYPOINT npm run start
