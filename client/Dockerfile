# Stage 1: build frontend
FROM node:10

WORKDIR /client
RUN mkdir static
COPY package*.json .postcssrc.js .babelrc index.html ./
COPY config ./config
COPY build ./build
COPY src ./src
RUN npm install
RUN npm run build

# Stage 2 - use only built static files to pack them into nginx container
FROM nginx:1.15.0

# copy build result from previous stage
COPY --from=0 /client/dist /static
COPY nginx-server.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
