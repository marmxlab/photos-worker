FROM node:10

# Create app directory
WORKDIR /usr/src/app

COPY ./docker/setup-converters.sh .

RUN ./setup-converters.sh

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY package*.json ./

RUN npm ci --only=production

COPY ./dist/ .

CMD [ "node", "index.js" ]
