import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { setModal } from '../redux/features/modal';
import * as cont from '../containers/chat';
import * as modal from '../components/modals';
import config from '../config';

function Chat() {
  const dispatch = useDispatch();
  const imageCropper = useSelector((state) => state.modal.imageCropper);
  const master = useSelector((state) => state.user.master);

  return (
    <div
      aria-hidden
      className="absolute w-full h-full overflow-hidden grid md:grid-cols-[380px_1fr] dark:text-white/90"
      onClick={() => {
        // close all modals
        dispatch(setModal({ target: '*' }));
      }}
    >
      <Helmet><title>{`@${master.username} - ${config.brandName}`}</title></Helmet>

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
      <modal.confirmAddParticipant />
      <modal.editGroup />

      <cont.foreground />
      <cont.room />
    </div>
  );
}

export default Chat;
