# Use Case Diagram

## Aktor

- **Customer**: pengguna yang membeli produk TDC.
- **Admin**: pengguna yang mengelola produk dan order.

## Diagram

```mermaid
flowchart LR
    Customer([Customer])
    Admin([Admin])

    subgraph System[TDC E-Commerce]
        A[Melihat Produk]
        B[Melihat Detail Produk]
        C[Memilih Variant]
        D[Mengelola Cart]
        E[Checkout]
        F[Membuat Order]

        G[Melihat Dashboard]
        H[Mengelola Variant dan Stock]
        I[Melihat Order]
        J[Mengubah Status Order]
    end

    Customer --> A
    Customer --> B
    Customer --> C
    Customer --> D
    Customer --> E
    Customer --> F

    Admin --> G
    Admin --> H
    Admin --> I
    Admin --> J