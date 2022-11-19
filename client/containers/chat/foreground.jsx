import React from 'react';
import { useSelector } from 'react-redux';
import * as fg from '../../components/chat/foreground';
import * as page from '../../pages';

function ForeGround() {
  const room = useSelector((state) => state.chat.room);

  return (
    <div className={`${room && '-translate-x-full md:translate-x-0'} transition w-full h-full relative z-10 grid grid-rows-[auto_1fr] overflow-hidden`}>
      <page.setting />
      <page.contact />
      <page.profile />
      <page.selectParticipant />

      <fg.minibox />
      <fg.openContact />
      <fg.header />
      <fg.inbox />
    </div>
  );
}

export default ForeGround;
