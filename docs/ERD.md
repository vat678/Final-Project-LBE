# Entity Relationship Diagram (ERD)

## Database Entity

- Category
- Product
- Product Variant
- Order
- Order Item
- Payment

## Diagram

```mermaid
erDiagram
    CATEGORY ||--o{ PRODUCT : memiliki
    PRODUCT ||--o{ PRODUCT_VARIANT : memiliki
    PRODUCT ||--o{ ORDER_ITEM : dipesan
    PRODUCT_VARIANT ||--o{ ORDER_ITEM : digunakan
    ORDER ||--|{ ORDER_ITEM : memiliki
    ORDER ||--o| PAYMENT : memiliki

    CATEGORY {
        uint id PK
        string name
    }

    PRODUCT {
        uint id PK
        string name
        string description
        float price
        int stock
        uint category_id FK
    }

    PRODUCT_VARIANT {
        uint id PK
        uint product_id FK
        string name
        int stock
    }

    ORDER {
        uint id PK
        string customer_name
        string phone
        string shipping_address
        float total
        string status
    }

    ORDER_ITEM {
        uint id PK
        uint order_id FK
        uint product_id FK
        uint variant_id FK
        int quantity
        float price
        float subtotal
    }

    PAYMENT {
        uint id PK
        uint order_id FK
        string method
        string bank_name
        float amount
        string status
    }