"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
  };
};

type Order = {
  id: number;
  customer_name: string;
  total: number;
  status: string;
  order_items: OrderItem[];
};

type BestSellingProduct = {
  productId: number;
  name: string;
  quantity: number;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/orders")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        return response.json();
      })
      .then((data) => {
        setOrders(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load dashboard data.");
        setLoading(false);
      });
  }, []);

  const totalRevenue = orders.reduce(
    (total, order) => total + order.total,
    0
  );

  const totalTransactions = orders.length;

  // Menghitung jumlah produk yang terjual
  const productSales: Record<
    number,
    {
      name: string;
      quantity: number;
    }
  > = {};

  orders.forEach((order) => {
    order.order_items.forEach((item) => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = {
          name: item.product.name,
          quantity: 0,
        };
      }

      productSales[item.product_id].quantity += item.quantity;
    });
  });

  const bestSellingProducts: BestSellingProduct[] = Object.entries(
    productSales
  )
    .map(([productId, product]) => ({
      productId: Number(productId),
      name: product.name,
      quantity: product.quantity,
    }))
    .sort((a, b) => b.quantity - a.quantity);

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm font-medium tracking-widest text-gray-500">
              TDC ADMIN
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Dashboard
            </h1>
          </div>

          <div className="flex gap-6">
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
              Back to Store
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {loading && (
          <p className="text-gray-500">
            Loading dashboard...
          </p>
        )}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            {/* OVERVIEW */}

            <div className="mb-8">
              <h2 className="text-xl font-semibold">
                Overview
              </h2>

              <p className="mt-1 text-gray-500">
                Summary of your store performance.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* TOTAL OMZET */}

              <div className="rounded-2xl border bg-white p-6">
                <p className="text-sm font-medium text-gray-500">
                  Total Omzet
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {formatPrice(totalRevenue)}
                </p>
              </div>

              {/* TOTAL TRANSAKSI */}

              <div className="rounded-2xl border bg-white p-6">
                <p className="text-sm font-medium text-gray-500">
                  Total Transaksi
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {totalTransactions}
                </p>
              </div>
            </div>

            {/* BEST SELLING PRODUCTS */}

            <div className="mt-10 rounded-2xl border bg-white p-6">
              <div>
                <h2 className="text-xl font-semibold">
                  Best-Selling Products
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Products with the highest number of units sold.
                </p>
              </div>

              <div className="mt-6">
                {bestSellingProducts.length === 0 ? (
                  <p className="text-gray-500">
                    No sales data available.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bestSellingProducts
                      .slice(0, 5)
                      .map((product, index) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                              {index + 1}
                            </span>

                            <div>
                              <p className="font-medium">
                                {product.name}
                              </p>

                              <p className="text-sm text-gray-500">
                                {product.quantity} units sold
                              </p>
                            </div>
                          </div>

                          <p className="text-sm font-medium">
                            {product.quantity} sold
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* RECENT ORDERS */}

            <div className="mt-10 rounded-2xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Latest transactions from your store.
                  </p>
                </div>

                <a
                  href="/admin/orders"
                  className="text-sm font-medium hover:underline"
                >
                  View all
                </a>
              </div>

              <div className="mt-6 space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">
                        #{order.id} — {order.customer_name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.status}
                      </p>
                    </div>

                    <p className="font-medium">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}