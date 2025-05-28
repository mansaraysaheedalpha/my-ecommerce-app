//src/store/api/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {type Product } from "../../../interfaces/Products";

const API_BASE_URL = "http://localhost:3000/api/";

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
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // endpoint to get all products
    getProducts: builder.query<GetProductsResponse, void>({
      query: () => "products",
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({
                type: "Product" as const,
                id: id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    //Endpoint to get a single Product by it's ID
    getProductById: builder.query<GetProductByIdResponse, string>({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id: id }],
    })
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery} = apiSlice;
