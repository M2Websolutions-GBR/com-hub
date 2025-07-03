FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

# COPY ../middleware /app/middleware

EXPOSE 3003

# CMD ["npm", "run", "dev"]
CMD ["node", "server.js"]
