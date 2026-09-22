package routes

import (
	"tdc-ecommerce-backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		// Products
		api.GET("/products", controllers.GetProducts)
		api.POST("/products", controllers.CreateProduct)
		api.GET("/products/:id", controllers.GetProduct)

		// Product Variants
		api.GET("/products/:id/variants", controllers.GetProductVariants)
		api.POST("/products/:id/variants", controllers.CreateProductVariant)
		api.PATCH(
			"/products/:id/variants/:variantId",
			controllers.UpdateProductVariant,
		)

		// Categories
		api.GET("/categories", controllers.GetCategories)
		api.POST("/categories", controllers.CreateCategory)

		// Orders
		api.POST("/orders", controllers.CreateOrder)
		api.GET("/orders", controllers.GetOrders)
		api.PATCH("/orders/:id/status", controllers.UpdateOrderStatus)
	}
}
