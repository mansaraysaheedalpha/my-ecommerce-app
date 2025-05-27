import { z } from "zod";
import mongoose from "mongoose";

const productCoreSchema = z.object({
  name: z
    .string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be a string",
    })
    .min(3, { message: "Product name must be at least 3 characters" }),

  imageUrl: z
    .string({
      required_error: "Image URL is required",
      invalid_type_error: "Image URL must be a string",
    })
    .url({ message: "Invalid image Url format" }),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive({ message: "Price must be a positive number" }),

  description: z.string().optional(),
  category: z.string().optional(),
  stock: z
    .number({
      invalid_type_error: "stock must be a number",
    })
    .int({ message: "stock must be an integer" })
    .nonnegative({ message: "stock cannot be negative" })
    .optional(),
});

export const createProductSchema = productCoreSchema;

export const updateProductBodySchema = productCoreSchema.partial();

export const idParamSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid Product ID format in URL parameter",
  }),
});

export type CreateProductInput = z.infer<typeof productCoreSchema>;
export type UpdateProductInput = z.infer<typeof updateProductBodySchema>;
