FROM node:16.15.0
# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./

COPY . .

RUN npm install
RUN npm run dev
RUN npm run start

ENV NODE_ENV development

EXPOSE 82

CMD ["node", "./vuesrc/app.js"]