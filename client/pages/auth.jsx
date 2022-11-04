import React, { useState } from 'react';
import * as fc from 'react-icons/fc';
import * as comp from '../components/auth';
import config from '../config';

function Auth() {
  const [respond, setRespond] = useState({ success: true, message: null });
  const [login, setLogin] = useState(true);

  return (
    <div className="absolute w-full h-full flex justify-center overflow-auto bg-white sm:bg-spill-100">
      <div className="p-6 w-[460px]">
        <h1 className="font-bold text-2xl font-display sm:text-center">{config.brandName}</h1>
        {/* body */}
        <div className="my-6 sm:p-6 rounded-md bg-white">
          {/* header */}
          <div>
            <h1 className="text-2xl font-bold">{login ? 'Sign in' : 'Sign up'}</h1>
            { respond.message && <p className={`${!respond.success && 'text-rose-800'} text-sm mt-1`}>{respond.message}</p> }
          </div>
          <div className="grid gap-2 mt-4">
            <button type="button" className="relative py-2 flex justify-center items-center rounded-md border border-solid border-gray-300 hover:bg-gray-50">
              <fc.FcGoogle size={20} className="absolute left-0 translate-x-4" />
              <p className="text-center">Continue with Google</p>
            </button>
          </div>
          <div className="mt-2 mb-4 grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <span className="block w-full h-[1px] bg-gray-300"></span>
            <p>or</p>
            <span className="block w-full h-[1px] bg-gray-300"></span>
          </div>
          {
            login
              ? <comp.login setRespond={setRespond} />
              : <comp.register setRespond={setRespond} />
          }
        </div>
        <div className="pb-6">
          <p className="sm:text-center">
            <span>{ login ? 'Don\'t have an account? ' : 'Have an account? ' }</span>
            <button
              type="button"
              className="font-bold inline-block hover:underline"
              onClick={() => {
                setRespond({ success: true, message: null });
                setLogin((prev) => !prev);
              }}
            >
              { login ? 'Sign up' : 'Sign in' }
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
