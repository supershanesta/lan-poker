FROM node:16.13.0-alpine

WORKDIR /home

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./workspaces/client ./workspaces/client
COPY ./workspaces/shared ./workspaces/shared

RUN yarn install --frozen-lockfile \
    && yarn build:prod:client \
    && rm -rf node_modules \
    && yarn install --production --prefer-offline \
    && yarn cache clean --all

CMD ["yarn", "start:prod:client"]
