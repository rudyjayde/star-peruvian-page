FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

# npm start -> prestart (sequelize-cli db:migrate) -> node server.js
CMD ["npm", "start"]
