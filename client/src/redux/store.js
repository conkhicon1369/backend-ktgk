// frontend/src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import rentalReducer from './rentalSlice';

export const store = configureStore({
  reducer: {
    rental: rentalReducer
  }
});