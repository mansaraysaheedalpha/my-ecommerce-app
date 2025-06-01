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

export const registerBodySchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z
      .string({
        required_error: "email is required",
        invalid_type_error: "email must be a string",
      })
      .email({ message: "Invalid email address format" })
      .trim(),
    password: z
      .string({
        required_error: "password is required",
      })
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .strict();

export const loginBodySchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email({ message: "Invalid email address format" })
    .trim(),
  password: z.string({
    required_error: "password is required",
  }),
});

export const refreshTokenBodySchema = z.object({
  token: z.string({
    required_error: "Refresh token is required",
  }),
});

export type CreateProductInput = z.infer<typeof productCoreSchema>;
export type UpdateProductInput = z.infer<typeof updateProductBodySchema>;

export type RegisterBodyType = z.infer<typeof registerBodySchema>;
export type LoginBodyType = z.infer<typeof loginBodySchema>;
export type RefreshTokenBodyType = z.infer<typeof refreshTokenBodySchema>;
