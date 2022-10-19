import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    master: null,
  },
  reducers: {
    setMaster(state, action) {
      state.master = action.payload;
    },
  },
});

export const { setMaster } = UserSlice.actions;
export default UserSlice.reducer;
