FROM node:16.17.0-alpine

# Create app directory
WORKDIR /app
COPY . .

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./

RUN npm install
RUN npm install -g serve

RUN npm run build

EXPOSE 3000
CMD [ "serve", "-s", "build" ]