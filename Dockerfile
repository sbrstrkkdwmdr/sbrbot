FROM node:18.12.1
# FROM rust:1.65.0

WORKDIR /app

COPY package*.json ./

RUN npm install
# error -> rosu-pp-js requires rust cargo
COPY . .

RUN tsc

CMD ["npm","run","run"]