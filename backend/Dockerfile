# Backend Dockerfile
FROM node:20.18.2

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start:prod"]
