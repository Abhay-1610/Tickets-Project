import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Ticket"],
  endpoints: (builder) => ({
    // Customer + Agent
    getMyTickets: builder.query({
      query: () => "/tickets/my",
      providesTags: ["Ticket"],
    }),

    // Agent + Admin
    getTickets: builder.query({
      query: () => "/tickets",
      providesTags: ["Ticket"],
    }),

    getTicketById: builder.query({
      query: (ticketId) => `/tickets/${ticketId}`,
      providesTags: (r, e, id) => [{ type: "Ticket", id }],
    }),

    createTicket: builder.mutation({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Ticket"],
    }),

    updateTicketStatus: builder.mutation({
      query: ({ ticketId, status }) => ({
        url: `/tickets/${ticketId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (r, e, { ticketId }) => [
        { type: "Ticket", id: ticketId },
      ],
    }),

    assignAgent: builder.mutation({
      query: (ticketId) => ({
        url: `/tickets/${ticketId}/assign`,
        method: "POST",
      }),
      invalidatesTags: ["Ticket"],
    }),

    // 🔑 Agent explicitly requests confirmation
    requestConfirmation: builder.mutation({
      query: (ticketId) => ({
        url: `/tickets/${ticketId}/request-confirmation`,
        method: "POST",
      }),
    }),

    // 🔑 Customer confirms resolution (Yes / No)
   confirmResolution: builder.mutation({
  query: ({ ticketId, isResolved }) => ({
    url: `/tickets/${ticketId}/confirm`,
    method: "POST",
    body: JSON.stringify(isResolved), // 🔑 stringify primitive
    headers: {
      "Content-Type": "application/json",
    },
  }),
}),

  }),
});

export const {
  useGetMyTicketsQuery,
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketStatusMutation,
  useAssignAgentMutation,
  useRequestConfirmationMutation,
  useConfirmResolutionMutation,
} = ticketsApi;
