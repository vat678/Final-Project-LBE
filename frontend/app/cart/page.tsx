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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("tdc-cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  function updateQuantity(
    id: number,
    variantId: number | null | undefined,
    quantity: number
  ) {
    if (quantity < 1) {
      removeItem(id, variantId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === id && item.variant_id === variantId
        ? { ...item, quantity }
        : item
    );

    setCart(updatedCart);

    localStorage.setItem(
      "tdc-cart",
      JSON.stringify(updatedCart)
    );
  }

  function removeItem(
    id: number,
    variantId: number | null | undefined
  ) {
    const updatedCart = cart.filter(
      (item) =>
        !(
          item.id === id &&
          item.variant_id === variantId
        )
    );

    setCart(updatedCart);

    localStorage.setItem(
      "tdc-cart",
      JSON.stringify(updatedCart)
    );
  }

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

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

          <div className="hidden gap-8 text-sm font-medium md:flex">

            <a
              href="/"
              className="hover:text-gray-500"
            >
              Home
            </a>

            <a
              href="/products"
              className="hover:text-gray-500"
            >
              Products
            </a>

            <a
              href="#"
              className="hover:text-gray-500"
            >
              About
            </a>

          </div>

          <a
            href="/cart"
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
          >
            Cart
          </a>

        </div>

      </nav>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            TDC Store
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight">
            Your Cart
          </h1>

        </div>

        {cart.length === 0 ? (

          /* EMPTY CART */
          <div className="border-t border-gray-200 py-20 text-center">

            <h2 className="text-2xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-500">
              Looks like you haven't added anything yet.
            </p>

            <a
              href="/products"
              className="mt-8 inline-block rounded-full bg-black px-7 py-3 font-medium text-white"
            >
              Browse Products
            </a>

          </div>

        ) : (

          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

            {/* CART ITEMS */}
            <div className="space-y-6">

              {cart.map((item) => (

                <div
                  key={`${item.id}-${item.variant_id ?? "no-variant"}`}
                  className="flex gap-6 border-b border-gray-200 pb-6"
                >

                  {/* IMAGE */}
                  <div className="h-32 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />

                  </div>

                  {/* INFO */}
                  <div className="flex flex-1 flex-col justify-between">

                    <div>

                      <h2 className="font-semibold">
                        {item.name}
                      </h2>

                      {item.variant_name && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.variant_name}
                        </p>
                      )}

                      <p className="mt-1 text-gray-600">
                        {formatPrice(item.price)}
                      </p>

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      {/* QUANTITY */}
                      <div className="flex items-center rounded-full border border-gray-300">

                        {/* MINUS */}
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.variant_id,
                              item.quantity - 1
                            )
                          }
                          className="px-4 py-2"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center text-sm">
                          {item.quantity}
                        </span>

                        {/* PLUS */}
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.variant_id,
                              item.quantity + 1
                            )
                          }
                          className="px-4 py-2"
                        >
                          +
                        </button>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeItem(
                            item.id,
                            item.variant_id
                          )
                        }
                        className="text-sm text-gray-500 underline hover:text-black"
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* SUMMARY */}
            <div className="h-fit rounded-2xl bg-gray-50 p-8">

              <h2 className="text-xl font-semibold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span>
                    {formatPrice(total)}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span>
                    Calculated at checkout
                  </span>

                </div>

                <div className="border-t border-gray-200 pt-4">

                  <div className="flex justify-between">

                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="font-semibold">
                      {formatPrice(total)}
                    </span>

                  </div>

                </div>

              </div>

              <a
                href="/checkout"
                className="mt-8 block rounded-full bg-black px-6 py-4 text-center font-medium text-white hover:bg-gray-800"
              >
                Proceed to Checkout
              </a>

            </div>

          </div>

        )}

      </section>

    </main>
  );
}