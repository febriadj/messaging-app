import { createSlice } from '@reduxjs/toolkit';

const RoomSlice = createSlice({
  name: 'room',
  initialState: {
    chat: {
      isOpen: false,
      refreshId: null,
      data: null,
    },
  },
  reducers: {
    setChatRoom(state, action) {
      const { isOpen, refreshId, data } = action.payload;

      state.chat.isOpen = isOpen;
      state.chat.refreshId = refreshId;
      state.chat.data = data;
    },
  },
});

export const { setChatRoom } = RoomSlice.actions;
export default RoomSlice.reducer;
