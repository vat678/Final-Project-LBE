package models

import "gorm.io/gorm"

type ProductVariant struct {
	ID        uint `gorm:"primaryKey" json:"id"`
	ProductID uint `json:"product_id"`

	Name  string `gorm:"not null" json:"name"`
	Stock int    `gorm:"not null;default:0" json:"stock"`

	Product Product `json:"product"`

	CreatedAt int64          `json:"created_at"`
	UpdatedAt int64          `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
