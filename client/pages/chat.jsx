import React from 'react';
import { useDispatch } from 'react-redux';
import { setModal } from '../redux/features/modal';
import * as cont from '../containers/chat';
import * as comp from '../components/utils';

function Chat() {
  const dispatch = useDispatch();
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
      <cont.foreground />
      <cont.room />
    </div>
  );
}

export default Chat;
