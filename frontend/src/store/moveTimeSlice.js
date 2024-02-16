import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const moveTimeSlice = createSlice({
  name: "moveTime",
  initialState,
  reducers: {
    calculation: (state) => {
      let prevLoca = null;

      for (let i = 0; i < state.list.length; i++) {
        for (let j = 0; j < state.list[i].length; j++) {
          if (state.list[i][j].title !== "") {
            if (prevLoca !== null) {
              calculateMoveTime(prevLoca, state[i][j].loca);
            }
            prevLoca = state[i][j].loca;
          }
        }
      }
    },
  },
});

export const moveTimeActions = moveTimeSlice.actions;

export default moveTimeSlice.reducer;

export const calculateMoveTime = (startLoca, endLoca) => {};
