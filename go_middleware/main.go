package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
)

func main() {
	router := gin.Default()
	router.GET("/ping", func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	router.GET("/users", func(context *gin.Context) {
		client := resty.New()
		response, err := client.R().EnableTrace().Get("http://127.0.0.1:5000/users")
		fmt.Println("Response body: " + string(response.Body()))
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		context.Data(response.StatusCode(), response.Header().Get("Content-Type"), response.Body())
	})

	router.Run()
}
