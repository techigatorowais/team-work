import { Client } from '@/interface';
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  teamMembers: null as any | null,
  selectedTeamMembers: [] as any,
  isLoading: false,
  error: null,
};


const teamMemberSlice = createSlice({
  name: 'teamMembers',
  initialState,
  reducers: {
    teamMembersFetchStart: (state) => {
      state.isLoading = true;
    },
    teamMembersFetchSuccess: (state, action) => {
      state.isLoading = false;
      state.teamMembers = action.payload.teamMembers;
      state.error = null;
    },
    teamMembersFetchFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    UpdateTeamMembers: (state, action) => {
      state.selectedTeamMembers = action.payload.newTeamMember;
    },
  },
});

export const { teamMembersFetchStart, teamMembersFetchSuccess, teamMembersFetchFailure, UpdateTeamMembers } = teamMemberSlice.actions;

export default teamMemberSlice.reducer;
