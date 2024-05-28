# node docker image
FROM node:21.6.2

# set frontend directory as working dir
WORKDIR /frontend

# copy code and assets to target dir
COPY . ./

# install dependencies
RUN npm install

# build for production
RUN npm run build

# start production server on port 3000
CMD ["npx", "serve", "-s", "build", "-p", "3000"]
