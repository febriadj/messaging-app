import React from 'react';
import * as cont from '../containers/chat';

function Chat() {
  return (
    <div className="absolute w-full h-full grid grid-cols-[440px_1fr]">
      <cont.foreground />
    </div>
  );
}

export default Chat;
