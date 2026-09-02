FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["sh", "-c", "node src/bot/index.js & node src/dashboard/server.js & wait"]
