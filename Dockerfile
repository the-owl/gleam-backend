FROM node:10


WORKDIR /app
COPY package*.json ./
RUN npm install

COPY src ./src
COPY defaults.yaml tsconfig.json ormconfig.js ./
RUN npm run build
RUN npm prune --production

EXPOSE 8000
CMD ["npm", "start"]
