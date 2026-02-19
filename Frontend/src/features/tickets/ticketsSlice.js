import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTicketId: null,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setSelectedTicketId(state, action) {
      state.selectedTicketId = action.payload;
    },
    clearSelectedTicketId(state) {
      state.selectedTicketId = null;
    },
  },
});

export const {
  setSelectedTicketId,
  clearSelectedTicketId,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
