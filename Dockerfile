FROM node:16.15.0 as builder-stage
# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./

COPY . .

RUN npm install
RUN npm run dev

EXPOSE 82

CMD ["node", "server.js"]