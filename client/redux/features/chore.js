import { createSlice } from '@reduxjs/toolkit';

const ChoreSlice = createSlice({
  name: 'chore',
  initialState: {
    selectedParticipants: [],
    selectedChats: [],
  },
  reducers: {
    /* eslint-disable no-param-reassign */
    setSelectedParticipants(state, action) {
      state.selectedParticipants = action.payload ?? [];
    },
    setSelectedChats(state, action) {
      const str = typeof action.payload === 'string';
      const chats = state.selectedChats;

      if (str) {
        state.selectedChats = !chats.includes(action.payload)
          ? [...chats, action.payload]
          : chats.filter((el) => el !== action.payload);
      } else {
        state.selectedChats = [];
      }
    },
    /* eslint-enable no-param-reassign */
  },
});

export const { setSelectedParticipants, setSelectedChats } = ChoreSlice.actions;
export default ChoreSlice.reducer;
