//src/store/api/apiSlice.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product } from "../../interfaces/Products";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/";

interface GetProductsResponse {
  message: string;
  count: number;
  products: Product[];
}

interface GetProductByIdResponse {
  message: string;
  product: Product;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductsResponse, void>({
      query: () => "products",
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Product" as const,
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProductById: builder.query<GetProductByIdResponse, string>({
      query: (id: string) => `products/${id}`,
      providesTags: (result, error, _id) => [{ type: "Product", id: _id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = apiSlice;
