import { createSlice } from '@reduxjs/toolkit';

const PageSlice = createSlice({
  name: 'page',
  initialState: {
    friendProfile: false,
    profile: false,
    contact: false,
    setting: false,
  },
  reducers: {
    setPage(state, action) {
      const { target = null, data = null } = action.payload;
      state[target] = data ?? !state[target];
    },
  },
});

export const { setPage } = PageSlice.actions;
export default PageSlice.reducer;
