import { createSlice } from '@reduxjs/toolkit';

const directionsSlice = createSlice({
  name: 'directions',
  initialState: [],
  reducers: {
    addDirections: (state, action) => {
      const { startAddress, endAddress, distance, duration, weekdayText } = action.payload;
      return [
        ...state,
        {
          startAddress: startAddress,
          endAddress: endAddress,
          distance: distance,
          duration: duration,
          weekdayText: weekdayText,
        }
      ];
    },
  },
});

export const directionsActions = directionsSlice.actions;
// Slice 자체를 export하지 않고 reducer 프로퍼티에 접근하여 export
export default directionsSlice.reducer;