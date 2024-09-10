FROM node:22

ADD ./src /app/src
# ADD ./store /app/store
ADD ./public /app/public
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

WORKDIR /app/

RUN npm ci

ENTRYPOINT [ "node", "src/index.js" ]
