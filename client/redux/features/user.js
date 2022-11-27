import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    master: null,
    avatar: null,
  },
  reducers: {
    /* eslint-disable no-param-reassign */
    setMaster(state, action) {
      state.master = action.payload;
    },
    setAvatar(state, action) {
      state.avatar = action.payload;
    },
    /* eslint-enable no-param-reassign */
  },
});

export const { setMaster, setAvatar } = UserSlice.actions;
export default UserSlice.reducer;
