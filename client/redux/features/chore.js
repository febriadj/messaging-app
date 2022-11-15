import { createSlice } from '@reduxjs/toolkit';

const ChoreSlice = createSlice({
  name: 'chore',
  initialState: {
    selectedParticipants: [],
  },
  reducers: {
    setSelectedParticipants(state, action) {
      state.selectedParticipants = action.payload ?? [];
    },
  },
});

export const { setSelectedParticipants } = ChoreSlice.actions;
export default ChoreSlice.reducer;
