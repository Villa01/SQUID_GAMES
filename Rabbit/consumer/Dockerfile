FROM golang:1.18-alpine

WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN go build -o /go_rabbit

CMD [ "/go_rabbit" ]

# docker build --tag diians2302/suscriber-go-k8s .
# docker push diians2302/suscriber-go-k8s
### docker run -d --name pruebarabbit diians2302/suscriber-go