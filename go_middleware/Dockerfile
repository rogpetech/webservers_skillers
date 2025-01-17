FROM golang:1.21-alpine

WORKDIR /app

COPY . /app

RUN go mod tidy && go build -o middleware

EXPOSE 8080

CMD [ "./middleware" ]