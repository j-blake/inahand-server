FROM node:16.14 as ts-build
WORKDIR /usr/src/app
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:16.14
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY --from=ts-build usr/src/app/dist ./dist
COPY ./.env ./.env
EXPOSE 3000
CMD ["yarn", "start"]