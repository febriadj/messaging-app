import React from 'react';
import { useSelector } from 'react-redux';
import * as comp from '../../components/chat/foreground';

function ForeGround() {
  const room = useSelector((state) => state.chat.room);

  return (
    <div className={`${room && '-translate-x-full md:translate-x-0'} transition w-full h-full relative z-10 grid grid-rows-[auto_1fr] overflow-hidden`}>
      <comp.minibox />
      <comp.setting />
      <comp.contact />
      <comp.profile />

      <comp.header />
      <comp.inbox />
    </div>
  );
}

export default ForeGround;
