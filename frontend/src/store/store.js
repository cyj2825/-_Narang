// 하나의 저장소를 유지하면서 개별적인 Slice 파일 관리 가능
import { configureStore } from "@reduxjs/toolkit";
import directionsSliceReducer from "./directionsSlice";
import placesSliceReducer from "./placeSlice";
import authReducer from "./authSlice";
import tripReducer from "./tripSlice";
import scheduleSliceReducer from "./scheduleSlice";
import BoardSliceReducer from "./boardSlice";
import conceptSliceReducer from "./conceptSlice"
const store = configureStore({
  reducer: {
    directions: directionsSliceReducer,
    places: placesSliceReducer,
    auth: authReducer,
    trip: tripReducer,
    schedule: scheduleSliceReducer,
    board: BoardSliceReducer,
    concept : conceptSliceReducer
  },
});

export default store;
