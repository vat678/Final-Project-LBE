package models

import "gorm.io/gorm"

type OrderItem struct {
	ID uint `gorm:"primaryKey" json:"id"`

	OrderID   uint  `gorm:"not null" json:"order_id"`
	ProductID uint  `gorm:"not null" json:"product_id"`
	VariantID *uint `json:"variant_id"`

	Quantity int     `gorm:"not null" json:"quantity"`
	Price    float64 `gorm:"not null" json:"price"`
	Subtotal float64 `gorm:"not null" json:"subtotal"`

	Order   Order   `json:"order"`
	Product Product `json:"product"`

	Variant *ProductVariant `json:"variant"`

	CreatedAt int64          `json:"created_at"`
	UpdatedAt int64          `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
