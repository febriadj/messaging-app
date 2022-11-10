import { createSlice } from '@reduxjs/toolkit';

const ModalSlice = createSlice({
  name: 'modal',
  initialState: {
    minibox: false,
    signout: false,
    newcontact: false,
    changePass: false,
    deleteAcc: false,
    qr: false,
  },
  reducers: {
    setModal(state, action) {
      const { target = '*', data = null } = action.payload;

      if (target) {
        Object.keys(state).forEach((key) => {
          if (target === key) {
            state[target] = data ?? !state[target];
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
