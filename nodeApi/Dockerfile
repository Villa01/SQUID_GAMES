FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent

COPY ./src/ ./src/

EXPOSE 5000

CMD [ "node", "src/server.js" ]

