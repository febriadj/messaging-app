import { createSlice } from '@reduxjs/toolkit';

const ModalSlice = createSlice({
  name: 'modal',
  initialState: {
    minibox: false,
    setting: false,
    contact: false,
    profile: false,
  },
  reducers: {
    setModal(state, action) {
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

export const { setModal } = ModalSlice.actions;
export default ModalSlice.reducer;
