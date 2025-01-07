import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: null,
  isLoading: false,
  error: null,
};

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    BrandsFetchStart: (state) => {
      state.isLoading = true;
    },
    BrandsFetchSuccess: (state, action) => {
      state.isLoading = false;
      state.brands = action.payload.brands;
      state.error = null;
    },
    BrandsFetchFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { BrandsFetchStart, BrandsFetchSuccess, BrandsFetchFailure } = brandSlice.actions;

export default brandSlice.reducer;
