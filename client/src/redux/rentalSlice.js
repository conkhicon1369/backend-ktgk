// frontend/src/redux/rentalSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const rentalSlice = createSlice({
  name: 'rental',
  initialState: {
    selectedBike: null,
    duration: 0,
    totalPrice: 0
  },
  reducers: {
    setRentalData: (state, action) => {
      state.selectedBike = action.payload.bike;
      state.duration = action.payload.duration;
      state.totalPrice = action.payload.totalPrice;
    },
    clearRentalData: (state) => {
      state.selectedBike = null;
      state.duration = 0;
      state.totalPrice = 0;
    }
  }
});

export const { setRentalData, clearRentalData } = rentalSlice.actions;
export default rentalSlice.reducer;