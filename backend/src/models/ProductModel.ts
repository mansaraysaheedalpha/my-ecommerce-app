import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "product's name required"],
    },
    imageUrl: {
      type: String,
      required: [true, "product's image required"],
    },
    price: {
      type: Number,
      required: [true, "product's price required"],
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    stock: {
      type: Number,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "Products_collection",
  }
);

const Product: mongoose.Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);
export default Product;
