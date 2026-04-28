# Node version 18 use kar rahe hain
FROM node:18-alpine

# Container ke andar 'app' naam ka folder banayega
WORKDIR /app

# Dependencies install karne ke liye files copy
COPY package*.json ./
RUN npm install

# Baaki saara frontend code copy
COPY . .

# React project ka production build banana
RUN npm run build

# Build hone ke baad app ko chalane ke liye ek light server
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]