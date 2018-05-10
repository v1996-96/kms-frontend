FROM node:latest

RUN git --version

COPY . /app
WORKDIR /app

RUN npm install --no-optional
RUN npm run build
RUN npm run serve

EXPOSE 8080
