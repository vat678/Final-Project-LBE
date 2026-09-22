package main

import (
	"net/http"

	"tdc-ecommerce-backend/database"
	"tdc-ecommerce-backend/models"
	"tdc-ecommerce-backend/routes"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "tdc-ecommerce-backend/docs"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// @title TDC E-Commerce API
// @version 1.0
// @description REST API untuk Platform Manajemen & Penjualan E-Commerce UKM TDC.
// @host localhost:8080
// @BasePath /
func main() {
	database.ConnectDatabase()

	database.DB.AutoMigrate(
		&models.Category{},
		&models.Product{},
		&models.ProductVariant{},
		&models.Order{},
		&models.OrderItem{},
		&models.Payment{},
	)

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
		},
	}))

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	routes.SetupRoutes(router)

	router.GET(
		"/swagger/*any",
		ginSwagger.WrapHandler(swaggerFiles.Handler),
	)

	router.Run(":8080")
}
