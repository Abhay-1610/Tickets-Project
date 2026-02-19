import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// RTK Query API for messages
export const messagesApi = createApi({
  reducerPath: "messagesApi", // key in redux store

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,

    // attach JWT token to every request
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // GET messages
    getMessagesByTicket: builder.query({
      query: (ticketId) => `/messages/ticket/${ticketId}`,
    }),

    // SEND message
    sendMessage: builder.mutation({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body,
      }),
    }),
  }),
});

// auto-generated hook
export const { useGetMessagesByTicketQuery,useSendMessageMutation} = messagesApi;
