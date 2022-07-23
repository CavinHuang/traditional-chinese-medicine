# use docker node latest
FROM node:latest
# create a directory to run docker
WORKDIR /app
# copy package.json into the new directory
COPY package.json /app
# install the dependencies
RUN npm install
# copy all other files into the app directory
COPY . /app
# open port 5000(这个是服务器访问端口)
EXPOSE 2333
# run the server
CMD npm run check