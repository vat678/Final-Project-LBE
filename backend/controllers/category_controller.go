package controllers

import (
	"net/http"

	"tdc-ecommerce-backend/database"
	"tdc-ecommerce-backend/models"

	"github.com/gin-gonic/gin"
)

// GetCategories godoc
// @Summary Get all categories
// @Description Get all product categories
// @Tags Categories
// @Produce json
// @Success 200
// @Failure 500
// @Router /api/categories [get]
func GetCategories(c *gin.Context) {
	var categories []models.Category

	result := database.DB.Find(&categories)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch categories",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": categories,
	})
}

// CreateCategory godoc
// @Summary Create category
// @Description Create a new product category
// @Tags Categories
// @Accept json
// @Produce json
// @Success 201
// @Failure 400
// @Failure 500
// @Router /api/categories [post]
func CreateCategory(c *gin.Context) {
	var category models.Category

	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	result := database.DB.Create(&category)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create category",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": category,
	})
}
