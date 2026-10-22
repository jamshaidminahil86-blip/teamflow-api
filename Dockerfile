
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://postgres:buildpassword@localhost:5432/teamflow" npx prisma generate
EXPOSE 5000

CMD ["node", "src/server.js"]
