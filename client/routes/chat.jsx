import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../redux/features/modal';
import * as cont from '../containers/chat';
import * as modal from '../components/modals';

function Chat() {
  const dispatch = useDispatch();
  const imageCropper = useSelector((state) => state.modal.imageCropper);

  return (
    <div
      aria-hidden
      className="absolute w-full h-full overflow-hidden grid md:grid-cols-[380px_1fr] dark:text-white/90"
      onClick={() => {
        // close all modals
        dispatch(setModal({ target: '*' }));
      }}
    >
      <modal.signout />
      <modal.changePass />
      <modal.deleteAcc />
      <modal.qr />
      <modal.newContact />
      <modal.newGroup />
      <modal.avatarUpload />
      <modal.webcam />
      { imageCropper && <modal.imageCropper /> }
      <modal.photoFull />
      <modal.confirmDeleteChat />
      <modal.sendFile />

      <cont.foreground />
      <cont.room />
    </div>
  );
}

export default Chat;
