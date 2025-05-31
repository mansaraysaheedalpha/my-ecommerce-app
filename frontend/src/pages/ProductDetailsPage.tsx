// src/pages/ProductDetailPage.tsx
import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom"; // Import Link for "Back to products"
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useGetProductByIdQuery } from "../store/api/apiSlice";
import { addItemToCart } from "../store/features/cart/cartSlice";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(productId!, { skip: !productId });
  const dispatch = useDispatch();

  if (!productId) {
    // Handle case where productId might somehow be undefined
    return <div className="text-center py-10">Invalid product ID.</div>;
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (isError) {
    console.error("Error fetching product:", error);

    let errorMessage = "Error loading product details. Please try again later.";
    if (error && "status" in error && error.status === 404) {
      errorMessage = (error.data as any)?.message || "Product not found.";
    } else if (error && "data" in error && (error.data as any)?.message) {
      errorMessage = (error.data as any)?.message;
    }
    return <div className="text-center py-10 text-red-500">{errorMessage}</div>;
  }
  const product = productData?.product;

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-slate-700 mb-4">
          Oops! Product Not Found
        </h2>
        <p className="text-slate-500 mb-8">
          We couldn't find the product you were looking for.
        </p>
        <RouterLink
          to="/products"
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold"
        >
          Back to Products
        </RouterLink>
      </div>
    );
  }

  const { imageUrl, name, price, description, category, stock } = product;

  const handleAddToCart = () => {
    dispatch(addItemToCart(product));
    toast.success(`${name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to products link */}
      <div className="mb-8">
        <RouterLink
          to="/products"
          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Products
        </RouterLink>
      </div>

      <div className="flex flex-col md:flex-row lg:gap-12">
        {/* Left Column: Product Image */}
        <div className="md:w-1/2 lg:w-2/5 mr-5">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-auto max-h-[500px] object-contain" // object-contain to see full image
            />
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="md:w-1/2 lg:w-3/5 ml-10">
          {category && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider ">
              {category}
            </span>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mt-3 mb-4">
            {name}
          </h1>

          <p className="text-3xl font-light text-slate-900 mb-6">
            ${price.toFixed(2)}
          </p>

          <div className="prose prose-slate max-w-none mb-6 text-slate-600">
            <p>{description}</p>
            {/* If description had more markdown/HTML, prose would style it nicely */}
          </div>

          {/* Quantity Selector (Placeholder for now) */}
          <div className="mb-6">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Quantity
            </label>
            <select
              id="quantity"
              name="quantity"
              className="mt-1 block w-20 py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              defaultValue="1"
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>

          <button
            className="w-full sm:w-auto bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-base font-semibold"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          {stock && (
            <p className="text-sm text-slate-500 mt-4">
              {stock > 0 ? `${stock} items in stock` : "Out of stock"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
