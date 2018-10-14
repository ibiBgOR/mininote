FROM node:6-alpine

MAINTAINER Ferdinand Mütsch <mail@ferdinand-muetsch.de>

WORKDIR /app

ENV MININOTE_PORT 3000

COPY . /app/

RUN cd /app && npm install

RUN cd /app/mininote-frontend && \
    npm install && \
    npm run build && \
    cd ..

ENTRYPOINT npm start
