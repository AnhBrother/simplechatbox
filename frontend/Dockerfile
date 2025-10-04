# Frontend Dockerfile
FROM node:20.18.2

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
