import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 1️⃣ normal base query (like axios instance)
const rawBaseQuery = fetchBaseQuery({
  
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});



// 2️⃣ wrapper to handle refresh automatically
const baseQueryWithRefresh = async (args, api, extraOptions) => {
  // try original request
  let result = await rawBaseQuery(args, api, extraOptions);

  // if access token expired
  if (result?.error?.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) return result;

    // call refresh api
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const { accessToken, refreshToken: newRefreshToken } = refreshResult.data;

      // save new tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      // retry original request
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithRefresh,

  endpoints: (builder) => ({
    // LOGIN
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation,useRegisterMutation } = authApi;
