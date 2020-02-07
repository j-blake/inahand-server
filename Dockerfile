FROM node:10.13-alpine
ENV NODE_ENV production
ENV DB_CONNECTION mongodb://development:sloth-assent-draggle1@ds115340.mlab.com:15340/inahand
ENV JWT_TOKEN narwhal 
ENV COOKIE_SECRET cookieambulance
ENV PORT 3000
ENV HTTPS_PORT 8443
ENV BCRYPT_SALT_ROUNDS 10
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD node server/server.js
