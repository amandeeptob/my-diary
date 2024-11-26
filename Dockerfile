FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
copy . .
EXPOSE 5000
CMD ["node","index.js"]