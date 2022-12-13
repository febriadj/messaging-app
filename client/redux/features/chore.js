import { createSlice } from '@reduxjs/toolkit';

const ChoreSlice = createSlice({
  name: 'chore',
  initialState: {
    selectedParticipants: [],
    selectedChats: [],
    refreshFriendProfile: null,
    refreshAvatar: null,
    refreshGroupAvatar: null,
    refreshContact: null,
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
    setRefreshFriendProfile(state, action) {
      state.refreshFriendProfile = action.payload;
    },
    setRefreshAvatar(state, action) {
      state.refreshAvatar = action.payload;
    },
    setRefreshGroupAvatar(state, action) {
      state.refreshGroupAvatar = action.payload;
    },
    setRefreshContact(state, action) {
      state.refreshContact = action.payload;
    },
    /* eslint-enable no-param-reassign */
  },
});

export const {
  setSelectedParticipants,
  setSelectedChats,
  setRefreshFriendProfile,
  setRefreshAvatar,
  setRefreshGroupAvatar,
  setRefreshContact,
} = ChoreSlice.actions;

export default ChoreSlice.reducer;
