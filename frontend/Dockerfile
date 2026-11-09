FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
COPY server.js ./
COPY public ./public
EXPOSE 80
CMD ["npm", "start"]
