FROM node:5-slim
MAINTAINER Liping
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production
# Bundle app source
COPY . /usr/src/app
# Environment Variables
ARG MYSQL_DB_HOST
ENV MYSQL_DB_HOST=$MYSQL_DB_HOST
ARG MYSQL_DB_PORT
ENV MYSQL_DB_PORT=$MYSQL_DB_PORT
ARG MYSQL_DB_USERNAME
ENV MYSQL_DB_USERNAME=$MYSQL_DB_USERNAME
ARG MYSQL_DB_PASSWORD
ENV MYSQL_DB_PASSWORD=$MYSQL_DB_PASSWORD
ARG MYSQL_DB_DATABASE
ENV MYSQL_DB_DATABASE=$MYSQL_DB_DATABASE
# Expose Port
EXPOSE 8080
# Start app
CMD [ "npm", "start" ]