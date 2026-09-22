"use client";

import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category_id: number;
  category: Category;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load products.");
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      {/* HEADER */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm font-medium tracking-widest text-gray-500">
              TDC ADMIN
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Products
            </h1>
          </div>

          <div className="flex gap-6">
            <a
              href="/admin"
              className="text-sm font-medium hover:underline"
            >
              Dashboard
            </a>

            <a
              href="/admin/orders"
              className="text-sm font-medium hover:underline"
            >
              Orders
            </a>

            <a
              href="/"
              className="text-sm font-medium hover:underline"
            >
              Store
            </a>
          </div>
        </div>
      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-6 py-10">
        {loading && (
          <p className="text-gray-500">
            Loading products...
          </p>
        )}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Product Catalog
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {products.length} products
                </p>
              </div>

              <button
                disabled
                className="rounded-full bg-gray-200 px-5 py-3 text-sm font-medium text-gray-500"
              >
                + Add Product
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-16 w-16 rounded-xl bg-gray-100 object-cover"
                          />

                          <div>
                            <p className="font-medium">
                              {product.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Product #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {product.category?.name || "-"}
                      </td>

                      <td className="px-6 py-5">
                        {formatPrice(product.price)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={
                            product.stock === 0
                              ? "font-medium text-red-600"
                              : "font-medium"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <a
                        href={`/admin/products/${product.id}`}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-black hover:text-white"
                        >
                            Manage
                            </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No products found.
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}