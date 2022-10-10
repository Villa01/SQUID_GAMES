# syntax=docker/dockerfile:1

FROM golang:1.16-alpine

WORKDIR /go/src/github.com/davidlux123/gRPC-service

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY / ./

RUN go build -o /docker-gs-ping

EXPOSE 8080

CMD [ "/docker-gs-ping" ]
