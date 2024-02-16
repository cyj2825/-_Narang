import { createSlice } from "@reduxjs/toolkit";
import { conceptTemaColorObject} from "../data/concepts"
const initialState = {
  concept: "건축",
  conceptColor: "teal",
};
const conceptSlice = createSlice({
  name: "concept",
  initialState,
  reducers: {
    changeConcept: (state, action) => {
      state.concept = action.payload.concept; // 컨셉 및 색깔 바꾸기
      state.conceptColor = conceptTemaColorObject[action.payload.concept];
    },
  },
});

export default conceptSlice.reducer;
export const conceptActions = conceptSlice.actions;
