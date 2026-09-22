# Project Requirement Document

## 1. Project Overview

**Nama Project:** TDC E-Commerce

TDC E-Commerce adalah platform web untuk membantu proses penjualan dan pengelolaan produk UKM TDC.

## 2. Tujuan

Project ini dibuat untuk:
- Memudahkan customer melihat dan membeli produk TDC.
- Membantu admin mengelola produk dan stock.
- Membantu admin melihat dan mengelola order.

## 3. User

### Customer
Customer dapat:
- Melihat produk
- Melihat detail produk
- Memilih variant
- Mengelola cart
- Melakukan checkout
- Membuat order

### Admin
Admin dapat:
- Melihat dashboard
- Mengelola variant dan stock
- Melihat order
- Mengubah status order

## 4. Fitur Utama

- Product catalog
- Product variant
- Shopping cart
- Checkout
- Order management
- Payment information
- Admin dashboard
- Stock management

## 5. Teknologi

- Next.js
- React
- TypeScript
- Golang
- Gin
- GORM
- PostgreSQL
- Swagger
- Bruno

## 6. Sistem

Sistem menggunakan frontend dan backend yang terhubung menggunakan REST API.

```text
Customer / Admin
       |
       v
Frontend
(Next.js)
       |
    REST API
       |
       v
Backend
(Golang + Gin)
       |
       v
PostgreSQL