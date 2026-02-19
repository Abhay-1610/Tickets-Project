import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// adapter knows how to store messages by id
const messagesAdapter = createEntityAdapter({
  selectId: (message) => message.id, // primary key
  sortComparer: (a, b) =>
    new Date(a.createdAt) - new Date(b.createdAt), // keep order
});

// initial normalized state
const initialState = messagesAdapter.getInitialState({
  initialized: false, // ⬅️ add this
});


const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // replace all messages (used after API fetch)
    setMessages: (state, action) => {
  // only set messages once
  if (!state.initialized) {
    messagesAdapter.setAll(state, action.payload);
    state.initialized = true;
  }
},


    // add one message (used by SignalR later)
    addMessage: (state, action) => {
  messagesAdapter.addOne(state, action.payload);
      },
    clearMessages: (state) => {
  messagesAdapter.removeAll(state);
  state.initialized = false;
},

  },
});

export const { setMessages, addMessage ,clearMessages} = messagesSlice.actions;
export default messagesSlice.reducer;

// selectors (used by UI)
export const {
  selectAll: selectAllMessages,
} = messagesAdapter.getSelectors(
  (state) => state.messages
);
