import { createSlice } from '@reduxjs/toolkit';

const boardSlice = createSlice({
  name: 'trip',
  initialState: {
    board: {
      title: '',
      concept: '',
      img: '',
      location: '',
      count: '',
      position: [],
      plan: '',
      description: '',
    },
    dateRange: [null, null],
  },
  reducers: {
    setBoard: (state, action) => {
      state.board = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
  },
});

export const boardActions = boardSlice.actions;

export default boardSlice.reducer;
