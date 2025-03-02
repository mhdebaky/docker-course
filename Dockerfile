
FROM node:22

WORKDIR /app

COPY package.json package-lock.json index.js ./
RUN npm install

# COPY . .

EXPOSE 3000

CMD ["node", "index.js"]