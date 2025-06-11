//src/store/api/apiSlice.ts
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import type { Product } from "../../interfaces/Products";
import type { RootState } from "../store";
import {
  clearCredentials,
  updateAccessToken,
} from "../features/auth/authSlice";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface UserAuthInfo {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createAt?: Date;
  updatedAt?: Date;
}

interface AuthResponse {
  message: string;
  user: UserAuthInfo;
  accessToken: string;
  refreshToken: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RefreshTokenApiResponse {
  accessToken: string;
  message: string;
}

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

interface GetMeResponse {
  message: string;
  user: UserAuthInfo;
}

const baseQueryOriginal = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReaut: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQueryOriginal(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQueryOriginal(
      { url: "auth/refresh", method: "POST" },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as RefreshTokenApiResponse)
        .accessToken;
      if (newAccessToken) {
        console.log(
          "[RTK-Reauth] Refresh SUCCESS. New accessToken:",
          newAccessToken
        );
        api.dispatch(updateAccessToken(newAccessToken));
        result = await baseQueryOriginal(args, api, extraOptions);
      } else {
        console.error(
          "Refresh token call succeeds but no new access token was received"
        );
        api.dispatch(clearCredentials());
      }
    } else {
      console.error(
        "[RTK-Reauth] Refresh FAILED. Logging out.",
        refreshResult.error
      );
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReaut,
  tagTypes: ["Product", "User"],
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
      providesTags: (result) =>
        result && result.product && result.product._id
          ? [{ type: "Product", id: result.product._id }]
          : [],
    }),
    getMe: builder.query<GetMeResponse, void>({
      query: () => "/auth/me",
      providesTags: (result) => (result ? [{ type: "User", id: "ME" }] : []),
    }),

    //---Auth Endpoints----
    registerUser: builder.mutation<AuthResponse, RegisterInput>({
      query: (credentials) => ({
        url: "auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    loginUser: builder.mutation<AuthResponse, LoginInput>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; // wait for logout API call to complete

          //dispatch clearCredential only after backend logout is successful
          dispatch(clearCredentials());

          dispatch(apiSlice.util.resetApiState()); // This would clear all RTK Query cache
        } catch (err) {
          console.error(
            "Backend logout failed, clearing local credentials anyway: ",
            err
          );
          dispatch(clearCredentials());
        }
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = apiSlice;
