import React from 'react';
import * as comp from '../components/auth';
import config from '../config';

function Auth() {
  return (
    <div className="absolute w-full h-full grid grid-cols-[460px_1fr]">
      <div className="relative">
        <comp.login />
      </div>
      <div className="flex justify-center items-center bg-gradient-to-tr from-teal-600 to-purple-800">
        <h1 className="text-8xl font-bold font-display text-white">{config.brandName}</h1>
      </div>
    </div>
  );
}

export default Auth;
