import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import placesReducer from './placesSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    places: placesReducer,
  },
});

export default store;
