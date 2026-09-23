FROM node:20
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD [ "npm", "start" ]