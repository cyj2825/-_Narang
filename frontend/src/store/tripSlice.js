import { createSlice } from "@reduxjs/toolkit";
import { loadTrip } from "../actions/trip";

const initialState = {
  loadTripLoading: false,
  loadTripDone: false,
  loadTripError: false,
  tripList: [],
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(loadTrip.pending, (state) => {
        state.loadTripLoading = true;
        state.loadTripDone = false;
        state.loadMovieError = null;
      })
      .addCase(loadTrip.fulfilled, (state, action) => {
        state.loadMovieLoading = false;
        state.loadMovieDone = true;
        state.movieList = [...state.tripList].concat(action.payload.results);
      })
      .addCase(loadTrip.rejected, (state, action) => {
        state.loadTripLoading = false;
        state.loadTripError = action.error;
      }),
});

export default tripSlice.reducer;
export const tripAction = tripSlice.actions;
