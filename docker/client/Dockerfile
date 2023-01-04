FROM node:16.13.0-alpine

WORKDIR /home

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./workspaces/client ./workspaces/client
COPY ./workspaces/shared ./workspaces/shared

WORKDIR /home/workspaces/client 

RUN yarn install --frozen-lockfile
RUN yarn build:prod

RUN rm -rf node_modules \
    && yarn install  --prefer-offline --production\
    && yarn cache clean --all

CMD ["yarn", "start:prod:client"]
