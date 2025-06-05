// frontend/src/pages/HomePage.tsx
import React from "react";
import { Link } from "react-router-dom"; // For the CTA button
import ProductCard from "../components/products/ProductCard";
import { useGetProductsQuery, useLazyGetMeQuery } from "../store/api/apiSlice"; // To fetch products
import { type Product } from "../interfaces/Products"; // Your Product interface
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
// We will import ProductCard and useGetProductsQuery later for Featured Products

const HomePage: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const currentUser = useSelector((state: RootState) => state.auth.userInfo);
  const [
    triggerGetMe,
    {
      isLoading: isLoadingMe,
      data: meData,
      isError: isMeError,
      error: meError,
    },
  ] = useLazyGetMeQuery();

  const handleFetchProfile = () => {
    triggerGetMe(); // Call the lazy query
  };

  const heroImageUrl =
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop";

  // Fetch products for the "Featured Products" section
  const { data: productsData, isLoading, isError } = useGetProductsQuery();

  // Determine which products to feature (e.g., first 4 or a random selection)
  // For now, let's just take the first 4 if available
  const featuredProducts = productsData?.products?.slice(0, 4) || [];

  // Placeholder data for categories
  const categories = [
    {
      name: "Electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=400&auto=format&fit=crop",
      href: "/products?category=electronics", // Example future link
    },
    {
      name: "Apparel",
      imageUrl:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=400&auto=format&fit=crop",
      href: "/products?category=apparel", // Example future link
    },
    {
      name: "Books",
      imageUrl:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop",
      href: "/products?category=books", // Example future link
    },
    {
      name: "Home Goods",
      imageUrl:
        "https://images.unsplash.com/photo-1556020685-ae41abfc9365?q=80&w=400&auto=format&fit=crop",
      href: "/products?category=homegoods", // Example future link
    },
  ];

  return (
    <div className="bg-slate-50">
      {" "}
      {/* Light background for the overall page if needed */}
      {/* Hero Section */}
      <div
        className="relative text-white py-32 px-6 md:py-38 bg-cover bg-center shadow-lg"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {" "}
            Discover Your Next Favorite Thing
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Explore SaloneAmazon for the latest trends, unique finds, and
            everyday essentials. Quality and style delivered to your doorstep.
          </p>
          <Link
            to="/products"
            className="bg-blue-600 py-3 px-10 text-lg font-semibold rounded-md hover:bg-blue-700 transition-colors ease-in-out duration-300 transform hover:scale-105 shadow-md"
          >
            Shop all Products
          </Link>
        </div>
      </div>
      {/* Featured Products Section will go here */}
      {/* <section className="py-12 md:py-20"> ... </section> */}
      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-slate-800 mb-12 md:mb-16">
            Featured Products
          </h2>
          {isLoading && (
            <div className="text-center text-slate-600">
              Loading featured products...
            </div>
          )}
          {isError && (
            <div className="text-red text-center">
              Could not load featured products
            </div>
          )}
          {!isLoading && !isError && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!isLoading &&
            !isError &&
            productsData &&
            productsData.products.length > 4 && (
              <div className="mt-12 text-center md:mt-16">
                <Link
                  to="/products"
                  className="bg-slate-700 hover:bg-slate-800 text-white font-semibold text-lg rounded-lg px-10 py-3 transition ease-in-out duration-300 transform hover:scale-105 shadow-md"
                >
                  View All Products
                </Link>
              </div>
            )}
        </div>
      </section>
      {/* Category Spotlights Section */}
      <section className="py-16 md:py-24 bg-slate-100">
        {" "}
        {/* Slightly different background for separation */}
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-12 md:mb-16">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="group block"
              >
                <div className="relative rounded-lg overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300 ease-in-out">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-30 group-hover:bg-opacity-20 transition-opacity duration-300"></div>{" "}
                  {/* Subtle overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-2xl font-semibold">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* ... Other sections can be added below ... */}
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-3xl md:text-4xl mb-12 md:mb-16 font-bold text-slate-800">
            Experience the Difference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              {/* <SVG></SVG> */}

              <svg
                className="w-16 h-16 text-blue-600 mb-4 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5V6.375c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v1.125c0 .621-.504 1.125-1.125 1.125H3.375m14.25-1.125V6.375m0 11.25V12m0 0V9.75M12 12v2.25"
                />
              </svg>
              <h4 className="text-xl font-semibold text-slate-700 mb-2">
                Fast and Reliable Delivery
              </h4>
              <p className="text-base text-slate-600">
                Get your favorite products delivered safely to your doorstep,
                anywhere in Sierra Leone. We ensure timely and careful handling.
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              {/* <SVG></SVG> */}

              <svg
                className="w-16 h-16 text-blue-600 mb-4 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h4 className="text-xl font-semibold text-slate-700 mb-2">
                Quality Guaranteed
              </h4>
              <p className="text-base text-slate-600">
                We curate our collection with a focus on quality and
                authenticity. Shop with confidence knowing you're getting the
                best.
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              {/* <SVG></SVG> */}

              <svg
                className="w-16 h-16 text-blue-600 mb-4 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <h4 className="text-xl font-semibold text-slate-700 mb-2">
                Supporting Local, Growing Together
              </h4>
              <p className="text-base text-slate-600">
                SaloneAmazon is proud to support local artisans and businesses,
                contributing to the growth of our vibrant community.
              </p>
            </div>
          </div>
        </div>
      </section>
      {isAuthenticated && (
        <section className="py-10 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-2xl font-semibold text-slate-700 mb-4">
              User Profile Test Area
            </h3>
            <p className="mb-2">Welcome, {currentUser?.name}!</p>
            <button
              onClick={handleFetchProfile}
              disabled={isLoadingMe}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
            >
              {isLoadingMe
                ? "Fetching Profile..."
                : "Fetch My Profile (Protected)"}
            </button>
            {meData && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                <h4 className="font-bold">Profile Data Received:</h4>
                <pre className="text-left whitespace-pre-wrap break-all">
                  {JSON.stringify(meData.user, null, 2)}
                </pre>
              </div>
            )}
            {isMeError && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                <h4 className="font-bold">Error Fetching Profile:</h4>
                <p>{(meError as any)?.data?.message || "An error occurred."}</p>
                <p>Status: {(meError as any)?.status}</p>
              </div>
            )}
          </div>
        </section>
      )}
      {/* Other sections like Category Spotlights can be added later */}
    </div>
  );
};

export default HomePage;
