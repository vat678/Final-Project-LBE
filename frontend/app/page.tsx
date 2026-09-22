const products = [
  {
    name: "TDC Oversized T-Shirt",
    category: "T-Shirt",
    price: "Rp120.000",
    image: "https://placehold.co/600x700?text=TDC+T-Shirt",
  },
  {
    name: "TDC Essential Hoodie",
    category: "Hoodie",
    price: "Rp180.000",
    image: "https://placehold.co/600x700?text=TDC+Hoodie",
  },
  {
    name: "TDC Canvas Tote Bag",
    category: "Accessories",
    price: "Rp90.000",
    image: "https://placehold.co/600x700?text=TDC+Tote+Bag",
  },
  {
    name: "TDC Classic Cap",
    category: "Accessories",
    price: "Rp75.000",
    image: "https://placehold.co/600x700?text=TDC+Cap",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      {/* NAVBAR */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <h1 className="text-2xl font-bold tracking-tight">
            TDC
          </h1>

          <div className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#" className="hover:text-gray-500">
              Home
            </a>

            <a href="/products" className="hover:text-gray-500">
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

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">

        <div className="grid items-center gap-12 md:grid-cols-2">

          <div>

            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
              TDC Official Store
            </p>

            <h2 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Simple.
              <br />
              Modern.
              <br />
              TDC.
            </h2>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
              Discover the latest collection from TDC.
              Designed for everyday use and made for our community.
            </p>

            <div className="mt-8 flex gap-4">

              <a
                href="/products"
                className="rounded-full bg-black px-7 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Shop Now
              </a>

              <a
                href="#featured"
                className="rounded-full border border-gray-300 px-7 py-3 font-medium transition hover:border-black"
              >
                Explore
              </a>

            </div>

          </div>

          {/* HERO IMAGE */}
          <div className="overflow-hidden rounded-3xl bg-gray-100">

            <img
              src="https://placehold.co/900x1000?text=TDC+COLLECTION"
              alt="TDC Collection"
              className="h-full w-full object-cover"
            />

          </div>

        </div>

      </section>

      {/* FEATURED PRODUCTS */}
      <section
        id="featured"
        className="border-t border-gray-200 bg-gray-50"
      >

        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-10 flex items-end justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Shop
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Featured Products
              </h2>
            </div>

            <a
              href="/products"
              className="text-sm font-medium underline underline-offset-4"
            >
              View all
            </a>

          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {products.map((product) => (

              <div
                key={product.name}
                className="group"
              >

                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-200">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                </div>

                <div className="mt-4">

                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {product.category}
                  </p>

                  <h3 className="mt-1 font-semibold">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-gray-600">
                    {product.price}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            © 2026 TDC. All rights reserved.
          </p>

          <p>
            TDC Official Store
          </p>

        </div>

      </footer>

    </main>
  );
}