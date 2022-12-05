import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    master: null,
  },
  reducers: {
    /* eslint-disable no-param-reassign */
    setMaster(state, action) {
      state.master = action.payload;
    },
    /* eslint-enable no-param-reassign */
  },
});

export const { setMaster } = UserSlice.actions;
export default UserSlice.reducer;
