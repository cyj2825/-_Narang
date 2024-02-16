import { createSlice } from "@reduxjs/toolkit";

const placesSlice = createSlice({
  name: "places",
  initialState: [],
  reducers: {
    setSearchResults: (state, action) => {
      const {
        name,
        photo,
        businessStatus,
        formattedAddress,
        icon,
        rating,
        weekdayText,
        url,
        loca,
      } = action.payload;
      return [
        ...state,
        {
          name: name,
          photo: photo,
          businessStatus: businessStatus,
          formattedAddress: formattedAddress,
          icon: icon,
          rating: rating,
          weedayText: weekdayText,
          url: url,
          loca: loca,
        },
      ];
    },
    reset: () => {
      return [];
    },
  },
});

export const placesActions = placesSlice.actions;
export default placesSlice.reducer;
