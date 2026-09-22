package controllers

import (
	"net/http"

	"tdc-ecommerce-backend/database"
	"tdc-ecommerce-backend/models"

	"github.com/gin-gonic/gin"
)

// GetProducts godoc
// @Summary Get all products
// @Description Get all products
// @Tags Products
// @Produce json
// @Success 200
// @Failure 500
// @Router /api/products [get]
func GetProducts(c *gin.Context) {
	var products []models.Product

	result := database.DB.Preload("Category").Find(&products)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch products",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": products,
	})
}

// CreateProduct godoc
// @Summary Create product
// @Description Create a new product
// @Tags Products
// @Accept json
// @Produce json
// @Success 201
// @Failure 400
// @Failure 500
// @Router /api/products [post]
func CreateProduct(c *gin.Context) {
	var product models.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid product data",
		})
		return
	}

	result := database.DB.Create(&product)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create product",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": product,
	})
}

// GetProduct godoc
// @Summary Get product by ID
// @Description Get product details by ID
// @Tags Products
// @Produce json
// @Param id path int true "Product ID"
// @Success 200
// @Failure 404
// @Failure 500
// @Router /api/products/{id} [get]
func GetProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product

	result := database.DB.Preload("Category").First(&product, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Product not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": product,
	})
}
