FROM node:12-slim

RUN mkdir -p /src/usr/app

WORKDIR /src/usr/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "./dist/app.js"]

