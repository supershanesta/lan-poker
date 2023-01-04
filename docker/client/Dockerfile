FROM node:16.13.0-alpine

WORKDIR /home

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./workspaces/client ./workspaces/client
COPY ./workspaces/shared ./workspaces/shared

RUN yarn install --production\
    && yarn build:prod:client
RUN rm -rf node_modules \
    && yarn install  --prefer-offline \
    && yarn cache clean --all

CMD ["yarn", "start:prod:client"]
