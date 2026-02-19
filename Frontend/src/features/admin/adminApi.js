import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Usv ers", "Tickets", "AuditLogs"],
  endpoints: (builder) => ({
    /* ================= USERS ================= */

    getUsers: builder.query({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),

    createAgent: builder.mutation({
      query: (body) => ({
        url: "/admin/agents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/block`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    unblockUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/unblock`,
        method: "POST",
      }),
      invalidatesTags: ["Users"],
    }),

    /* ================= TICKETS ================= */

    getAllTickets: builder.query({
      query: () => "/tickets",
      providesTags: ["Tickets"],
    }),

    // PRIMARY AGENT (self-assign)
    assignTicket: builder.mutation({
      query: (ticketId) => ({
        url: `/tickets/${ticketId}/assign`,
        method: "POST",
      }),
      invalidatesTags: ["Tickets"],
    }),

    // 🔥 SECONDARY AGENT (ADMIN ONLY)
    assignSecondaryAgent: builder.mutation({
      query: ({ ticketId, agentId }) => ({
        url: `/tickets/${ticketId}/assign-secondary`,
        method: "POST",
        body: { agentId },
      }),
      invalidatesTags: ["Tickets"],
    }),

    updateTicketStatus: builder.mutation({
      query: ({ ticketId, status }) => ({
        url: `/tickets/${ticketId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Tickets"],
    }),

    /* ================= AUDIT LOGS ================= */

    getAuditLogs: builder.query({
      query: () => "/admin/audit-logs",
      providesTags: ["AuditLogs"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateAgentMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetAllTicketsQuery,
  useGetAuditLogsQuery,
  useAssignTicketMutation,
  useAssignSecondaryAgentMutation, // ✅ EXPORT THIS
  useUpdateTicketStatusMutation,
} = adminApi;
