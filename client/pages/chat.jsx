import React from 'react';
import * as cont from '../containers/chat';
import * as comp from '../components/chat';

function Chat() {
  return (
    <div className="absolute w-full h-full grid grid-cols-[440px_1fr] dark:text-white/90">
      <comp.signout />
      <cont.foreground />
      <cont.room />
    </div>
  );
}

export default Chat;
