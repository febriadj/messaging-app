import { createSlice } from '@reduxjs/toolkit';

const ChatSlice = createSlice({
  name: 'chat',
  initialState: {
    room: null,
  },
  reducers: {
    setRoom(state, action) {
      state.room = action.payload;
    },
  },
});

export const { setRoom } = ChatSlice.actions;
export default ChatSlice.reducer;
