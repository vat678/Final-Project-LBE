package models

import "gorm.io/gorm"

type Order struct {
	ID uint `gorm:"primaryKey" json:"id"`

	CustomerName    string `gorm:"not null" json:"customer_name"`
	Phone           string `gorm:"not null" json:"phone"`
	ShippingAddress string `gorm:"not null" json:"shipping_address"`

	Total  float64 `gorm:"not null" json:"total"`
	Status string  `gorm:"not null;default:'Pending'" json:"status"`

	OrderItems []OrderItem `json:"order_items"`
	Payment    *Payment    `json:"payment"`

	CreatedAt int64          `json:"created_at"`
	UpdatedAt int64          `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
