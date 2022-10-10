FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 50051

CMD ["npm","start"]

### docker build --tag diians2302/server-grpc-k8s .
### docker push diians2302/server-grpc-k8s
### docker run -d -p 50051:50051 --name pruebaserver diians2302/server-grpc_201903865
