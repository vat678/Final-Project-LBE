"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductsPage() {
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
            <a href="/" className="hover:text-gray-500">
              Home
            </a>

            <a href="/products" className="font-semibold">
              Products
            </a>

            <a href="#" className="hover:text-gray-500">
              About
            </a>
          </div>

          <a
            href="/cart"
            className="rounded-full border border-black px-5 py-2 text-sm font-medium hover:bg-black hover:text-white"
          >
            Cart
          </a>

        </div>
      </nav>


      {/* HEADER */}
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-16">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
          TDC Store
        </p>

        <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              All Products
            </h1>

            <p className="mt-4 max-w-xl text-gray-600">
              Explore our latest collection of TDC products,
              merchandise, and accessories.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            {products.length} products
          </p>

        </div>

      </section>


      {/* CATEGORY FILTER */}
      <section className="border-y border-gray-200">

        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-4">

          <button className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white">
            All
          </button>

          <button className="rounded-full border border-gray-300 px-5 py-2 text-sm hover:border-black">
            T-Shirt
          </button>

          <button className="rounded-full border border-gray-300 px-5 py-2 text-sm hover:border-black">
            Hoodie
          </button>

          <button className="rounded-full border border-gray-300 px-5 py-2 text-sm hover:border-black">
            Accessories
          </button>

        </div>

      </section>


      {/* PRODUCT GRID */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading products...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {/* PRODUCTS */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">

            {products.map((product) => (

              <a
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >

                {/* IMAGE */}
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                </div>


                {/* INFO */}
                <div className="mt-4">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        {product.category.name}
                      </p>

                      <h2 className="mt-1 font-semibold">
                        {product.name}
                      </h2>

                    </div>

                    <p className="whitespace-nowrap font-medium">
                      {formatPrice(product.price)}
                    </p>

                  </div>


                  {/* STOCK */}
                  <p className="mt-2 text-sm text-gray-500">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </p>

                </div>

              </a>

            ))}

          </div>
        )}

      </section>

    </main>
  );
}