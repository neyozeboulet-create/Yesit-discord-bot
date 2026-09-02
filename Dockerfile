FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000 8000 8080
ENV NODE_ENV=production
ENV PORT=8000
CMD ["sh", "-c", "node src/bot/index.js & PORT=${PORT:-8000} node src/dashboard/server.js & wait"]
