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

type Payment = {
  id: number;
  method: string;
  bank_name: string | null;
  amount: number;
  status: string;
};

type Order = {
  id: number;
  customer_name: string;
  phone: string;
  shipping_address: string;
  total: number;
  status: string;
  order_items: OrderItem[];
  payment: Payment | null;
  created_at: number;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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
        setError("Failed to load orders.");
        setLoading(false);
      });
  }, []);

  async function updateStatus(orderId: number, newStatus: string) {
    setUpdatingId(orderId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update order status");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      setError("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm font-medium tracking-widest text-gray-500">
              TDC ADMIN
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Orders
            </h1>
          </div>

          <a
            href="/"
            className="text-sm font-medium hover:underline"
          >
            Back to Store
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {loading && (
          <p className="text-gray-500">
            Loading orders...
          </p>
        )}

        {error && (
          <p className="mb-6 text-red-600">
            {error}
          </p>
        )}

        {!loading && (
          <>
            <div className="mb-6">
              <p className="text-gray-500">
                {orders.length} orders
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-6 py-5 font-semibold">
                        #{order.id}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium">
                          {order.customer_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.phone}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        {formatPrice(order.total)}
                      </td>

                      <td className="px-6 py-5">
                        <p>
                          {order.payment?.method || "-"}
                        </p>

                        {order.payment?.bank_name && (
                          <p className="text-sm text-gray-500">
                            {order.payment.bank_name}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            updateStatus(
                              order.id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-black"
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Verified">
                            Verified
                          </option>

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Completed">
                            Completed
                          </option>
                        </select>

                        {updatingId === order.id && (
                          <p className="mt-1 text-xs text-gray-500">
                            Updating...
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {orders.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No orders found.
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}