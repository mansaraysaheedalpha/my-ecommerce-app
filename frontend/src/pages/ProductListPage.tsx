import React from "react";
import ProductCard from "../components/products/ProductCard";
import { type Product } from "../interfaces/Products";
import { useGetProductsQuery } from "../store/api/apiSlice";

const ProductListPage: React.FC = () => {
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery();

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }
  if (isError) {
    console.error("Error fetching products:", error);

    return (
      <div className="text-center py-10 text-red-500">
        Error loading products. Please try again later.
      </div>
    );
  }

  const products = productsData?.products;

  if (!products || products.length === 0) {
    return <div className="text-center py-10">No products found.</div>;
  }
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
