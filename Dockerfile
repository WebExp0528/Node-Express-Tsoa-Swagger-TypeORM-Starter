FROM node:lts

WORKDIR /app
COPY ./package*.json ./
COPY . .
RUN yarn install

EXPOSE 8000
CMD ["yarn", "dev"]