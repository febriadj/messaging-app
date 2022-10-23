import { createSlice } from '@reduxjs/toolkit';

const SubModalSlice = createSlice({
  name: 'submodal',
  initialState: {
    newcontact: false,
  },
  reducers: {
    setSubModal(state, action) {
      const { target = null, data = null } = action.payload;

      if (target) {
        Object.keys(state).forEach((key) => {
          if (target === key) {
            state[target] = data || !state[target];
          } else {
            state[key] = false;
          }
        });
      }
    },
  },
});

export const { setSubModal } = SubModalSlice.actions;
export default SubModalSlice.reducer;
