import { Client } from "@/interface";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: null as any | null,
  isLoading: false,
  error: null,
};

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    ClientsFetchStart: (state) => {
      state.isLoading = true;
    },
    ClientsFetchSuccess: (state, action) => {
      console.log("ClientsFetchSuccess__");
      state.isLoading = false;
      state.clients = action.payload.clients;
      state.error = null;
    },
    ClientsFetchFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    AddNewClient: (state, action) => {
      if (state.clients) {
        state.clients = [...state.clients, action.payload.newClient];
      } else {
        state.clients = [action.payload.newClient];
      }
    },
  },
});

export const {
  ClientsFetchStart,
  ClientsFetchSuccess,
  ClientsFetchFailure,
  AddNewClient,
} = clientSlice.actions;

export default clientSlice.reducer;
