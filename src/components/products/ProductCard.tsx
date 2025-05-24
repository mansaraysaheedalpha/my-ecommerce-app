import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import type { Product } from "../../interfaces/Products";
import { addItemToCart } from "../../store/features/cart/cartSlice";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, imageUrl, name, price, category } = product;
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItemToCart(product))
    toast.success(`${name} added to cart!`)
  }

  return (
    <div className="group relative bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
      <Link to={`/products/${id}`}>
        <div className="w-full h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-100 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>

        {/* Always Visible Content Area (Name & Category/Short Desc) */}
        <div className="p-4 pb-2">
          <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate title={name}">
            {name}
          </h3>
          <p className="text-sm text-slate-500">
            {category || "Featured Product"}
          </p>
        </div>
      </Link>

      {/* Hover Panel: Slides up from bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] backdrop-blur-sms p-4  transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out">
        <p className="text-lg font-bold text-slate-900 mb-3">
          ${price.toFixed(2)}
        </p>
        <button className="w-full bg-blue-600 py-2.5 px-4 rounded-md text-white text-sm font-semibold hover:bg-blue-700"
        onClick={handleAddToCart}>
          Add to Cart
        </button>

        <Link
          to={`/products/${id}`}
          className="block text-sm text-center text-blue-600 mt-2 hover:text-blue-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
