import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import { authApi } from "../features/auth/authApi";

import ticketsReducer from "../features/tickets/ticketsSlice";
import { ticketsApi } from "../features/tickets/ticketsApi";
import { messagesApi } from "../features/messages/messagesApi";
import messagesReducer from "../features/messages/messagesSlice";
import { adminApi } from "../features/admin/adminApi";


export const store = configureStore({
  reducer: {
    auth: authReducer,                               // auth UI state
    tickets: ticketsReducer,                         // tickets UI state
    messages: messagesReducer,

    [authApi.reducerPath]: authApi.reducer,           // auth RTK Query
    [ticketsApi.reducerPath]: ticketsApi.reducer,     // tickets RTK Query
    [messagesApi.reducerPath]: messagesApi.reducer,   // messages RTK Query
    [adminApi.reducerPath]: adminApi.reducer    //admin RTK Query
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      ticketsApi.middleware,
      messagesApi.middleware,
      adminApi.middleware,
    ),
});
