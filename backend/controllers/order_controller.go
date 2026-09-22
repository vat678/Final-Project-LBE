package controllers

import (
	"net/http"

	"tdc-ecommerce-backend/database"
	"tdc-ecommerce-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateOrderItemRequest struct {
	ProductID uint  `json:"product_id" binding:"required"`
	VariantID *uint `json:"variant_id"`
	Quantity  int   `json:"quantity" binding:"required,min=1"`
}

type CreateOrderPaymentRequest struct {
	Method   string  `json:"method" binding:"required"`
	BankName *string `json:"bank_name"`
}

type CreateOrderRequest struct {
	CustomerName    string                    `json:"customer_name" binding:"required"`
	Phone           string                    `json:"phone" binding:"required"`
	ShippingAddress string                    `json:"shipping_address" binding:"required"`
	ShippingCost    float64                   `json:"shipping_cost"`
	Items           []CreateOrderItemRequest  `json:"items" binding:"required,min=1"`
	Payment         CreateOrderPaymentRequest `json:"payment" binding:"required"`
}

// CreateOrder godoc
// @Summary Create order
// @Description Create a new customer order
// @Tags Orders
// @Accept json
// @Produce json
// @Success 201
// @Failure 400
// @Failure 500
// @Router /api/orders [post]
func CreateOrder(c *gin.Context) {
	var request CreateOrderRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid order data",
		})
		return
	}

	var createdOrder models.Order

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		order := models.Order{
			CustomerName:    request.CustomerName,
			Phone:           request.Phone,
			ShippingAddress: request.ShippingAddress,
			Total:           request.ShippingCost,
			Status:          "Pending",
		}

		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		var subtotal float64

		for _, item := range request.Items {
			var product models.Product

			if err := tx.First(&product, item.ProductID).Error; err != nil {
				return err
			}

			var price float64
			var variantID *uint

			if item.VariantID != nil {
				var variant models.ProductVariant

				if err := tx.
					Where("id = ? AND product_id = ?", *item.VariantID, item.ProductID).
					First(&variant).Error; err != nil {
					return err
				}

				if variant.Stock < item.Quantity {
					return gorm.ErrInvalidData
				}

				variant.Stock -= item.Quantity

				if err := tx.Save(&variant).Error; err != nil {
					return err
				}

				price = product.Price
				variantID = item.VariantID
			} else {
				if product.Stock < item.Quantity {
					return gorm.ErrInvalidData
				}

				product.Stock -= item.Quantity

				if err := tx.Save(&product).Error; err != nil {
					return err
				}

				price = product.Price
			}

			itemSubtotal := price * float64(item.Quantity)
			subtotal += itemSubtotal

			orderItem := models.OrderItem{
				OrderID:   order.ID,
				ProductID: product.ID,
				VariantID: variantID,
				Quantity:  item.Quantity,
				Price:     price,
				Subtotal:  itemSubtotal,
			}

			if err := tx.Create(&orderItem).Error; err != nil {
				return err
			}
		}

		order.Total = subtotal + request.ShippingCost

		if err := tx.Save(&order).Error; err != nil {
			return err
		}

		payment := models.Payment{
			OrderID:  order.ID,
			Method:   request.Payment.Method,
			BankName: request.Payment.BankName,
			Amount:   order.Total,
			Status:   "Pending",
		}

		if err := tx.Create(&payment).Error; err != nil {
			return err
		}

		createdOrder = order

		return nil
	})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create order",
		})
		return
	}

	database.DB.
		Preload("OrderItems").
		Preload("OrderItems.Product").
		Preload("OrderItems.Variant").
		Preload("Payment").
		First(&createdOrder, createdOrder.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Order created successfully",
		"data":    createdOrder,
	})
}

// GetOrders godoc
// @Summary Get all orders
// @Description Get all customer orders
// @Tags Orders
// @Produce json
// @Success 200
// @Failure 500
// @Router /api/orders [get]
func GetOrders(c *gin.Context) {
	var orders []models.Order

	result := database.DB.
		Preload("OrderItems").
		Preload("OrderItems.Product").
		Preload("OrderItems.Variant").
		Preload("Payment").
		Order("created_at DESC").
		Find(&orders)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch orders",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": orders,
	})
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

// UpdateOrderStatus godoc
// @Summary Update order status
// @Description Update the status of an order
// @Tags Orders
// @Accept json
// @Produce json
// @Param id path int true "Order ID"
// @Success 200
// @Failure 400
// @Failure 404
// @Failure 500
// @Router /api/orders/{id}/status [patch]
func UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")

	var request UpdateOrderStatusRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid status data",
		})
		return
	}

	allowedStatuses := map[string]bool{
		"Pending":   true,
		"Verified":  true,
		"Shipped":   true,
		"Completed": true,
	}

	if !allowedStatuses[request.Status] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid order status",
		})
		return
	}

	var order models.Order

	result := database.DB.First(&order, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Order not found",
		})
		return
	}

	order.Status = request.Status

	if err := database.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update order status",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Order status updated successfully",
		"data":    order,
	})
}
