package models

import "gorm.io/gorm"

type Payment struct {
	ID uint `gorm:"primaryKey" json:"id"`

	OrderID uint `gorm:"not null;unique" json:"order_id"`

	Method   string  `gorm:"not null" json:"method"`
	BankName *string `json:"bank_name"`
	Amount   float64 `gorm:"not null" json:"amount"`
	Status   string  `gorm:"not null;default:'Pending'" json:"status"`

	PaidAt *int64 `json:"paid_at"`

	Order *Order `json:"order"`

	CreatedAt int64          `json:"created_at"`
	UpdatedAt int64          `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
