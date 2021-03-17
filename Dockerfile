FROM node:12
WORKDIR /usr/src/clean-node-api

COPY ./package.json .
RUN npm install --only=prod

RUN command

RUN npm run build

EXPOSE 5000

CMD npm start
