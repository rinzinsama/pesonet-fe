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

FROM nginx:stable-alpine as production-stage

COPY --from=node /app/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 82

CMD ["nginx", "-g", "daemon off"]