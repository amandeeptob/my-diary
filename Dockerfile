FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
copy . .
EXPOSE 8080
CMD ["node","index.js"]