import React from "react";
import type { Product } from "../../interfaces/Products";
// If you want to use Link for "View Details" later
// import { Link } from 'react-router-dom';

type ProductCardProps = {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {imageUrl, name, price, category} = product
  return (
    <div className="group relative bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
      {/* Product Image Container */}
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" // Zoom effect on image
        />
      </div>

      {/* Always Visible Content Area (Name & Category/Short Desc) */}
      <div className="p-4 pb-2">
        {" "}
        {/* Reduced bottom padding to make space for hover panel if it overlaps slightly */}
        <h3
          className="text-lg font-semibold text-slate-800 mb-1 truncate"
          title={name}
        >
          {name}
        </h3>
        <p className="text-sm text-slate-500">
          {category || "Featured Product"}
        </p>
      </div>

      {/* Hover Panel: Slides up from bottom, has its own background */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sm
                   p-4 transform translate-y-full group-hover:translate-y-0 
                   transition-all duration-300 ease-in-out"
        //  The `backdrop-blur-sm` gives a slight frosted glass effect if you like it.
        //  Remove `bg-opacity-95` and `backdrop-blur-sm` for a solid white background.
        //  The `shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)]` is a custom top shadow for the panel.
      >
        <p className="text-xl font-bold text-slate-800 mb-3">
          ${price.toFixed(2)}
        </p>
        <button className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-sm font-semibold">
          Add to Cart
        </button>
        {/* Example "View Details" link - uncomment and style if needed 
        <Link 
          to={`/products/${product.id}`} // Assuming you'll have product detail pages later
          className="block text-center mt-2 text-xs text-blue-600 hover:text-blue-800"
        >
          View Details
        </Link>
        */}
      </div>
    </div>
  );
};

export default ProductCard;
