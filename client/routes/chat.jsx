import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../redux/features/modal';
import * as cont from '../containers/chat';
import * as comp from '../components/modals';

function Chat() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  return (
    <div
      aria-hidden
      className="absolute w-full h-full overflow-hidden grid md:grid-cols-[380px_1fr] dark:text-white/90"
      onClick={() => {
        // close all modals
        dispatch(setModal({ target: '*' }));
      }}
    >
      <comp.signout />
      <comp.changePass />
      <comp.deleteAcc />
      <comp.qr />
      <comp.newContact />
      <comp.newGroup />
      <comp.avatarUpload />
      <comp.webcam />
      { modal.imageCropper && <comp.imageCropper /> }

      <cont.foreground />
      <cont.room />
    </div>
  );
}

export default Chat;
