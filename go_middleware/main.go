package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
)

func main() {
	router := gin.Default()

	// CORS
	router.Use(corsMiddleware())
	router.GET("/ping", func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// routes middleware

	// resources users
	router.GET("/users", proxyRequest("http://localhost:8000/users"))
	router.GET("/users/:id", proxyRequest("http://localhost:8000/users/:id"))
	router.POST("/users", proxyRequest("http://localhost:8000/users"))
	router.PUT("/users/:id", proxyRequest("http://localhost:8000/users/:id"))
	router.DELETE("/users/:id", proxyRequest("http://localhost:8000/users/:id"))

	// resources courses
	router.GET("/courses", proxyRequest("http://localhost:9292/courses"))
	router.GET("/courses/:id", proxyRequest("http://localhost:9292/courses/:id"))
	router.POST("/courses", proxyRequest("http://localhost:9292/courses"))
	router.PUT("/courses/:id", proxyRequest("http://localhost:9292/courses/:id"))
	router.DELETE("/courses/:id", proxyRequest("http://localhost:9292/courses/:id"))

	// resources attendances
	router.GET("/attendances", proxyRequest("http://localhost:9292/attendances"))
	router.GET("/attendances/:id", proxyRequest("http://localhost:9292/attendances/:id"))
	router.POST("/attendances", proxyRequest("http://localhost:9292/attendances"))
	router.PUT("/attendances/:id", proxyRequest("http://localhost:9292/attendances/:id"))
	router.DELETE("/attendances/:id", proxyRequest("http://localhost:9292/attendances/:id"))
	// resources lessons
	router.GET("/lessons", proxyRequest("http://localhost:9292/lessons"))
	router.GET("/lessons/:id", proxyRequest("http://localhost:9292/lessons/:id"))
	router.POST("/lessons", proxyRequest("http://localhost:9292/lessons"))
	router.PUT("/lessons/:id", proxyRequest("http://localhost:9292/lessons/:id"))
	router.DELETE("/lessons/:id", proxyRequest("http://localhost:9292/lessons/:id"))
	// resources scores
	router.GET("/scores", proxyRequest("http://localhost:8080/scores"))
	router.GET("/scores/:id", proxyRequest("http://localhost:8080/scores/:id"))
	router.POST("/scores", proxyRequest("http://localhost:8080/scores"))
	router.PUT("/scores/:id", proxyRequest("http://localhost:8080/scores/:id"))
	router.DELETE("/scores/:id", proxyRequest("http://localhost:8080/scores/:id"))

	router.Run(":8087")
}

func proxyRequest(url string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		client := resty.New()
		request := client.R()

		for _, param := range ctx.Params {
			url = strings.Replace(url, ":"+param.Key, param.Value, 1)
		}

		var resp *resty.Response
		var err error

		switch ctx.Request.Method {
		case "GET":
			resp, err = request.Get(url)
		case "POST":
			resp, err = request.SetBody(ctx.Request.Body).Post(url)
		case "PUT":
			resp, err = request.SetBody(ctx.Request.Body).Put(url)
		case "DELETE":
			resp, err = request.Delete(url)
		default:
			ctx.JSON(http.StatusMethodNotAllowed, gin.H{"error": "Method isn't permit"})
			return
		}

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}

		ctx.Data(resp.StatusCode(), resp.Header().Get("Content-Type"), resp.Body())
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		context.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		context.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		context.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		context.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept, X-Requested-With, Authrization")

		if context.Request.Method == "OPTIONS" {
			context.AbortWithStatus(204)
			return
		}

		context.Next()
	}
}
