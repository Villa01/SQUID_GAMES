#- container "squidgamesfrontend" - production v.0.1.0
#- by Erick VIllatoro | 04/16/2022# build environment

FROM node:16-alpine as build
# set working directory
WORKDIR /app
# install app dependencies

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
#RUN npm install react-scripts@3.4.1 -g --silent
# add app
COPY . ./

# build
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]