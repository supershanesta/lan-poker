FROM node:16.13.0-alpine

WORKDIR /home

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./workspaces/server ./workspaces/server
COPY ./workspaces/shared ./workspaces/shared

RUN yarn install \
    && yarn cache clean --all

CMD ["yarn", "start:prod:server"]
