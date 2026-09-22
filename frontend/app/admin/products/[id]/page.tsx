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

export default function ManageProductPage() {
  const params = useParams();

  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddVariant, setShowAddVariant] = useState(false);
  const [variantName, setVariantName] = useState("");
  const [variantStock, setVariantStock] = useState("");
  const [addingVariant, setAddingVariant] = useState(false);
  const [variantError, setVariantError] = useState("");

  const [editingVariantId, setEditingVariantId] = useState<number | null>(
    null
  );
  const [editingStock, setEditingStock] = useState("");
  const [savingStock, setSavingStock] = useState(false);
  const [stockError, setStockError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [productResponse, variantResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/products/${id}`),
          fetch(`http://localhost:8080/api/products/${id}/variants`),
        ]);

        if (!productResponse.ok) {
          throw new Error("Failed to fetch product");
        }

        if (!variantResponse.ok) {
          throw new Error("Failed to fetch variants");
        }

        const productData = await productResponse.json();
        const variantData = await variantResponse.json();

        setProduct(productData.data);
        setVariants(variantData.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to load product.");
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  function startEditStock(variant: ProductVariant) {
    setEditingVariantId(variant.id);
    setEditingStock(String(variant.stock));
    setStockError("");
  }

  function cancelEditStock() {
    setEditingVariantId(null);
    setEditingStock("");
    setStockError("");
  }

  async function saveStock(variantId: number) {
    const stock = Number(editingStock);

    if (editingStock === "" || stock < 0) {
      setStockError("Stock must be 0 or greater.");
      return;
    }

    setSavingStock(true);
    setStockError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${id}/variants/${variantId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock: stock,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update stock"
        );
      }

      setVariants((currentVariants) =>
        currentVariants.map((variant) =>
          variant.id === variantId
            ? { ...variant, stock: data.data.stock }
            : variant
        )
      );

      setEditingVariantId(null);
      setEditingStock("");
    } catch (error) {
      console.error(error);
      setStockError("Failed to update stock.");
    } finally {
      setSavingStock(false);
    }
  }

  async function addVariant() {
    if (!variantName.trim()) {
      setVariantError("Variant name is required.");
      return;
    }

    const stock = Number(variantStock);

    if (variantStock === "" || stock < 0) {
      setVariantError("Stock must be 0 or greater.");
      return;
    }

    setAddingVariant(true);
    setVariantError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${id}/variants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: variantName,
            stock: stock,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create variant"
        );
      }

      setVariants((currentVariants) => [
        ...currentVariants,
        data.data,
      ]);

      setVariantName("");
      setVariantStock("");
      setShowAddVariant(false);
    } catch (error) {
      console.error(error);
      setVariantError("Failed to create variant.");
    } finally {
      setAddingVariant(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading product...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Product Not Found
          </h1>

          <a
            href="/admin/products"
            className="mt-4 inline-block underline"
          >
            Back to Products
          </a>
        </div>
      </main>
    );
  }

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
              Manage Product
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
              href="/admin/products"
              className="text-sm font-medium hover:underline"
            >
              Products
            </a>

            <a
              href="/admin/orders"
              className="text-sm font-medium hover:underline"
            >
              Orders
            </a>
          </div>
        </div>
      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-5xl px-6 py-10">
        <a
          href="/admin/products"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Products
        </a>

        {/* PRODUCT INFO */}

        <div className="mt-8 rounded-2xl border bg-white p-6">
          <div className="flex gap-6">
            <img
              src={product.image}
              alt={product.name}
              className="h-32 w-32 rounded-2xl bg-gray-100 object-cover"
            />

            <div>
              <p className="text-sm text-gray-500">
                Product #{product.id}
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {product.name}
              </h2>

              <p className="mt-2 text-gray-600">
                {product.category?.name || "-"}
              </p>

              <p className="mt-2 font-medium">
                {formatPrice(product.price)}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Product Stock: {product.stock}
              </p>
            </div>
          </div>
        </div>

        {/* VARIANTS */}

        <div className="mt-8 rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Variants
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage stock for this product's variants.
              </p>
            </div>

            <button
              onClick={() => {
                setShowAddVariant(true);
                setVariantError("");
              }}
              className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              + Add Variant
            </button>
          </div>

          {showAddVariant && (
            <div className="mb-6 rounded-xl border bg-gray-50 p-5">
              <h3 className="font-semibold">
                Add Variant
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Variant Name
                  </label>

                  <input
                    type="text"
                    value={variantName}
                    onChange={(e) =>
                      setVariantName(e.target.value)
                    }
                    placeholder="e.g. Red - XL"
                    className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={variantStock}
                    onChange={(e) =>
                      setVariantStock(e.target.value)
                    }
                    placeholder="10"
                    className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>

              {variantError && (
                <p className="mt-3 text-sm text-red-600">
                  {variantError}
                </p>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    setShowAddVariant(false);
                    setVariantName("");
                    setVariantStock("");
                    setVariantError("");
                  }}
                  className="rounded-lg border px-5 py-3 text-sm font-medium hover:bg-white"
                >
                  Cancel
                </button>

                <button
                  onClick={addVariant}
                  disabled={addingVariant}
                  className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-300"
                >
                  {addingVariant
                    ? "Adding..."
                    : "Add Variant"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Variant
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {variants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-5 py-4 font-medium">
                      {variant.name}
                    </td>

                    <td className="px-5 py-4">
                      {editingVariantId === variant.id ? (
                        <input
                          type="number"
                          min="0"
                          value={editingStock}
                          onChange={(e) =>
                            setEditingStock(e.target.value)
                          }
                          className="w-24 rounded-lg border px-3 py-2"
                        />
                      ) : (
                        variant.stock
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {variant.stock > 0 ? (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {editingVariantId === variant.id ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                saveStock(variant.id)
                              }
                              disabled={savingStock}
                              className="rounded-lg bg-black px-3 py-2 text-sm text-white"
                            >
                              {savingStock
                                ? "Saving..."
                                : "Save"}
                            </button>

                            <button
                              onClick={cancelEditStock}
                              className="rounded-lg border px-3 py-2 text-sm"
                            >
                              Cancel
                            </button>
                          </div>

                          {stockError && (
                            <p className="mt-2 text-sm text-red-600">
                              {stockError}
                            </p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            startEditStock(variant)
                          }
                          className="text-sm font-medium underline"
                        >
                          Edit Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {variants.length === 0 && (
              <div className="px-5 py-10 text-center text-gray-500">
                No variants found.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}