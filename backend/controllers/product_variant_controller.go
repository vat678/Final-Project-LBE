package controllers

import (
	"net/http"
	"strconv"

	"tdc-ecommerce-backend/database"
	"tdc-ecommerce-backend/models"

	"github.com/gin-gonic/gin"
)

func GetProductVariants(c *gin.Context) {
	productID := c.Param("id")

	var variants []models.ProductVariant

	result := database.DB.
		Where("product_id = ?", productID).
		Find(&variants)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch product variants",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": variants,
	})
}

func CreateProductVariant(c *gin.Context) {
	productID, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid product ID",
		})
		return
	}

	var variant models.ProductVariant

	if err := c.ShouldBindJSON(&variant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid variant data",
		})
		return
	}

	if variant.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Variant name is required",
		})
		return
	}

	if variant.Stock < 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Stock cannot be negative",
		})
		return
	}

	variant.ProductID = uint(productID)

	result := database.DB.Create(&variant)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create product variant",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": variant,
	})
}

type UpdateProductVariantRequest struct {
	Stock int `json:"stock"`
}

func UpdateProductVariant(c *gin.Context) {
	productID, err := strconv.ParseUint(
		c.Param("id"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid product ID",
		})
		return
	}

	variantID, err := strconv.ParseUint(
		c.Param("variantId"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid variant ID",
		})
		return
	}

	var request UpdateProductVariantRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid stock data",
		})
		return
	}

	if request.Stock < 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Stock cannot be negative",
		})
		return
	}

	var variant models.ProductVariant

	result := database.DB.
		Where(
			"id = ? AND product_id = ?",
			variantID,
			productID,
		).
		First(&variant)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Variant not found",
		})
		return
	}

	variant.Stock = request.Stock

	if err := database.DB.Save(&variant).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update variant stock",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Variant stock updated successfully",
		"data":    variant,
	})
}
