import React from 'react';
import * as comp from '../../components/chat/foreground';

function ForeGround() {
  return (
    <div className="relative z-10 grid grid-rows-[auto_1fr] overflow-hidden">
      <comp.minibox />
      <comp.setting />
      <comp.contact />
      <comp.profile />

      <comp.header />
    </div>
  );
}

export default ForeGround;
