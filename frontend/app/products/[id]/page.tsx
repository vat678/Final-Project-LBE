"use client";

import { useParams } from "next/navigation";
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

type ProductVariant = {
  id: number;
  product_id: number;
  name: string;
  stock: number;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductDetail() {
  const params = useParams();

  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProductData() {
      try {
        const [productResponse, variantResponse] =
          await Promise.all([
            fetch(`http://localhost:8080/api/products/${id}`),
            fetch(
              `http://localhost:8080/api/products/${id}/variants`
            ),
          ]);

        if (!productResponse.ok) {
          throw new Error("Product not found");
        }

        if (!variantResponse.ok) {
          throw new Error("Failed to fetch variants");
        }

        const productData = await productResponse.json();
        const variantData = await variantResponse.json();

        setProduct(productData.data);
        setVariants(variantData.data);

        if (variantData.data.length > 0) {
          setSelectedVariant(variantData.data[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Product not found.");
        setLoading(false);
      }
    }

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading product...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Product Not Found
          </h1>

          <a
            href="/products"
            className="mt-6 inline-block underline"
          >
            Back to Products
          </a>
        </div>
      </main>
    );
  }

  const availableStock =
    selectedVariant !== null
      ? selectedVariant.stock
      : product.stock;

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

            <a
              href="/products"
              className="hover:text-gray-500"
            >
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

      {/* PRODUCT */}

      <section className="mx-auto max-w-7xl px-6 py-16">
        <a
          href="/products"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Products
        </a>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          {/* IMAGE */}

          <div className="overflow-hidden rounded-3xl bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* INFO */}

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
              {product.category.name}
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-medium">
              {formatPrice(product.price)}
            </p>

            <p className="mt-6 max-w-lg leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* VARIANTS */}

            {variants.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium">
                  Variant
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {variants.map((variant) => {
                    const isSelected =
                      selectedVariant?.id === variant.id;

                    const isOutOfStock =
                      variant.stock === 0;

                    return (
                      <button
                        key={variant.id}
                        disabled={isOutOfStock}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setQuantity(1);
                          setAdded(false);
                        }}
                        className={`rounded-xl border px-4 py-4 text-left transition ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                        } ${
                          isOutOfStock
                            ? "cursor-not-allowed opacity-40"
                            : ""
                        }`}
                      >
                        <p className="font-medium">
                          {variant.name}
                        </p>

                        <p
                          className={`mt-1 text-sm ${
                            isSelected
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {isOutOfStock
                            ? "Out of stock"
                            : `${variant.stock} available`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STOCK */}

            <div className="mt-8 border-y border-gray-200 py-5">
              <p className="text-sm">
                <span className="font-semibold">
                  Stock:
                </span>{" "}

                {availableStock > 0
                  ? `${availableStock} available`
                  : "Out of stock"}
              </p>
            </div>

            {/* QUANTITY */}

            {availableStock > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium">
                  Quantity
                </p>

                <div className="flex w-fit items-center rounded-full border border-gray-300">
                  <button
                    onClick={() =>
                      setQuantity((current) =>
                        Math.max(1, current - 1)
                      )
                    }
                    className="px-5 py-3 text-lg"
                  >
                    −
                  </button>

                  <span className="min-w-10 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((current) =>
                        Math.min(
                          availableStock,
                          current + 1
                        )
                      )
                    }
                    className="px-5 py-3 text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* ADD TO CART */}

            <button
              disabled={availableStock === 0}
              onClick={() => {
                const existingCart = JSON.parse(
                  localStorage.getItem("tdc-cart") || "[]"
                );

                const existingItem = existingCart.find(
                  (item: {
                    id: number;
                    variant_id?: number;
                  }) =>
                    item.id === product.id &&
                    item.variant_id === selectedVariant?.id
                );

                let updatedCart;

                if (existingItem) {
                  updatedCart = existingCart.map(
                    (item: {
                      id: number;
                      quantity: number;
                      variant_id?: number;
                    }) =>
                      item.id === product.id &&
                      item.variant_id === selectedVariant?.id
                        ? {
                            ...item,
                            quantity:
                              item.quantity + quantity,
                          }
                        : item
                  );
                } else {
                  updatedCart = [
                    ...existingCart,
                    {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      quantity: quantity,
                      image: product.image,

                      variant_id:
                        selectedVariant?.id ?? null,

                      variant_name:
                        selectedVariant?.name ?? null,
                    },
                  ];
                }

                localStorage.setItem(
                  "tdc-cart",
                  JSON.stringify(updatedCart)
                );

                setAdded(true);
              }}
              className="mt-8 w-full rounded-full bg-black px-8 py-4 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {availableStock === 0
                ? "Out of Stock"
                : added
                ? "Added to Cart ✓"
                : "Add to Cart"}
            </button>

            {added && (
              <a
                href="/cart"
                className="mt-3 text-center text-sm font-medium underline"
              >
                Go to Cart
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}