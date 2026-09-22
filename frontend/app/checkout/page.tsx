"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant_id?: number | null;
  variant_name?: string | null;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Bank Transfer");
  const [bank, setBank] = useState("BCA");


  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("tdc-cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const shipping = 15000;

  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (cart.length === 0) {
    return;
  }

  setSubmitting(true);
  setError("");

  try {
    const order = {
      customer_name: name,
      phone: phone,
      shipping_address: address,
      shipping_cost: shipping,
      items: cart.map((item) => ({
        product_id: item.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      })),
      payment: {
        method: payment,
        bank_name: payment === "Bank Transfer" ? bank : null,
      },
    };

    const response = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create order");
    }

    localStorage.setItem(
      "tdc-last-order",
      JSON.stringify(data.data)
    );

    localStorage.removeItem("tdc-cart");

    setSubmitted(true);
  } catch (error) {
    console.error(error);

    setError(
      error instanceof Error
        ? error.message
        : "Failed to create order"
    );
  } finally {
    setSubmitting(false);
  }
}

  if (submitted) {
    return (
      <main className="min-h-screen bg-white text-black">

        <nav className="border-b border-gray-200">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <a
              href="/"
              className="text-2xl font-bold tracking-tight"
            >
              TDC
            </a>

            <a
              href="/products"
              className="text-sm font-medium"
            >
              Continue Shopping
            </a>

          </div>

        </nav>

        <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl text-white">
            ✓
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Order Received
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight">
            Thank You!
          </h1>

          <p className="mt-5 leading-relaxed text-gray-600">
            Your order has been successfully submitted.
            We will verify your order and process it shortly.
          </p>

          <div className="mt-8 rounded-2xl bg-gray-50 px-8 py-5">

            <p className="text-sm text-gray-500">
              Order Status
            </p>

            <p className="mt-1 font-semibold">
              Pending Verification
            </p>

          </div>

          <a
            href="/products"
            className="mt-8 rounded-full bg-black px-8 py-4 font-medium text-white"
          >
            Continue Shopping
          </a>

        </section>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">

      {/* NAVBAR */}
      <nav className="border-b border-gray-200">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            TDC
          </a>

          <a
            href="/cart"
            className="text-sm font-medium hover:underline"
          >
            ← Back to Cart
          </a>

        </div>

      </nav>


      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
          TDC Store
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight">
          Checkout
        </h1>


        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">

          {/* CUSTOMER FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            <div>

              <h2 className="text-xl font-semibold">
                Customer Information
              </h2>

              <div className="mt-6 space-y-5">

                {/* NAME */}
                <div>

                  <label className="text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    required
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />

                </div>


                {/* PHONE */}
                <div>

                  <label className="text-sm font-medium">
                    Phone Number
                  </label>

                  <input
                    required
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="08xxxxxxxxxx"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />

                </div>


                {/* ADDRESS */}
                <div>

                  <label className="text-sm font-medium">
                    Shipping Address
                  </label>

                  <textarea
                    required
                    value={address}
                    onChange={(e) =>
                      setAddress(e.target.value)
                    }
                    placeholder="Enter your complete address"
                    rows={4}
                    className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />

                </div>

              </div>

            </div>


            {/* PAYMENT */}
<div>

  <h2 className="text-xl font-semibold">
    Payment Method
  </h2>

  <div className="mt-6 space-y-4">

    {/* BANK TRANSFER */}
    <div
      className={`rounded-xl border p-5 transition ${
        payment === "Bank Transfer"
          ? "border-black"
          : "border-gray-300"
      }`}
    >

      <label className="flex cursor-pointer items-center gap-3">

        <input
          type="radio"
          name="payment"
          value="Bank Transfer"
          checked={payment === "Bank Transfer"}
          onChange={(e) =>
            setPayment(e.target.value)
          }
        />

        <div>
          <p className="font-medium">
            Bank Transfer
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Transfer melalui rekening bank TDC
          </p>
        </div>

      </label>


      {/* BANK SELECTION */}
      {payment === "Bank Transfer" && (

        <div className="mt-5">

          <label className="text-sm font-medium">
            Select Bank
          </label>

          <select
            value={bank}
            onChange={(e) =>
              setBank(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
          >

            <option value="BCA">
              BCA
            </option>

            <option value="Mandiri">
              Bank Mandiri
            </option>

            <option value="BNI">
              BNI
            </option>

            <option value="BRI">
              BRI
            </option>

          </select>

        </div>

      )}

    </div>


    {/* QRIS */}
    <div
      className={`rounded-xl border p-5 transition ${
        payment === "QRIS"
          ? "border-black"
          : "border-gray-300"
      }`}
    >

      <label className="flex cursor-pointer items-center gap-3">

        <input
          type="radio"
          name="payment"
          value="QRIS"
          checked={payment === "QRIS"}
          onChange={(e) =>
            setPayment(e.target.value)
          }
        />

        <div>

          <p className="font-medium">
            QRIS
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Scan QRIS untuk melakukan pembayaran
          </p>

        </div>

      </label>


      {/* QRIS PREVIEW */}
      {payment === "QRIS" && (

        <div className="mt-5 rounded-xl bg-gray-50 p-6 text-center">

          <div className="mx-auto flex h-48 w-48 items-center justify-center border border-gray-300 bg-white">

            <div className="text-center">

              <p className="text-3xl font-bold tracking-widest">
                QRIS
              </p>

              <p className="mt-2 text-xs text-gray-500">
                TDC OFFICIAL STORE
              </p>

            </div>

          </div>

          <p className="mt-4 text-sm text-gray-600">
            QRIS pembayaran akan ditampilkan
            setelah order dibuat.
          </p>

        </div>

      )}

    </div>

  </div>

</div>


            <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-black px-8 py-4 font-medium text-white hover:bg-gray-800"
            >
              {submitting ? "Processing..." : "Place Order"}
              </button>

          </form>

          {error && (
            <p className="mb-4 text-sm text-red-600">
              {error}
              </p>
            )}


          {/* ORDER SUMMARY */}
          <div className="h-fit rounded-2xl bg-gray-50 p-8">

            <h2 className="text-xl font-semibold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between gap-4"
                >

                  <div>

                    <p className="font-medium">
                      {item.name}
                    </p>

                    {item.variant_name && (
                      <p className="text-sm text-gray-500">
                        {item.variant_name}
                        </p>
                      )}

                    <p className="mt-1 text-sm text-gray-500">
                      {item.quantity} ×{" "}
                      {formatPrice(item.price)}
                    </p>

                  </div>

                  <p className="font-medium">
                    {formatPrice(
                      item.price * item.quantity
                    )}
                  </p>

                </div>

              ))}

            </div>


            <div className="mt-8 space-y-4 border-t border-gray-200 pt-6">

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Subtotal
                </span>

                <span>
                  {formatPrice(subtotal)}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-600">
                  Shipping
                </span>

                <span>
                  {formatPrice(shipping)}
                </span>

              </div>

              <div className="flex justify-between border-t border-gray-200 pt-4">

                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-semibold">
                  {formatPrice(total)}
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}