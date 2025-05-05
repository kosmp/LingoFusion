FROM node:14-alpine

WORKDIR /app

COPY package.json ./
RUN npm i --package-lock-only

COPY package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
CMD ["npm", "start"]
