# base image of our docker image
FROM node:21-alpine

# create needed directories for project files
# -p flag allows for the creation of parent directories
RUN mkdir -p /home/node/app/node_modules

# set the working directory, commands will now be run here
WORKDIR /home/node/app

# copy package.json and package-lock.json to working directory
COPY package.json ./
COPY package-lock.json ./

# change ownership of new directory to node user
# node user already exists in node:21-alpine image
RUN chown -R node:node /home/node/app

# switch user to node
USER node

# install dependencies
RUN npm install

# copy project application code
COPY . .

# expose port 8080 for access
EXPOSE 3000

# run the application using the node command
CMD [ "node", "server.js" ]
