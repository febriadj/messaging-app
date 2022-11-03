import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../redux/features/modal';

function Logout() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  return (
    <div
      className={`
        ${modal.signout ? 'delay-75 z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/40 dark:bg-black/40 dark:text-white/90
      `}
    >
      <div
        aria-hidden
        className={`${!modal.signout && 'scale-0'} transition w-[400px] m-10 p-5 rounded-md bg-white dark:bg-spill-700`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="text-2xl font-bold mb-1">Sign out</h1>
        <p>Are you sure you want to sign out?</p>
        <span className="flex gap-2 mt-5 justify-end">
          <button
            type="button"
            className="py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-spill-600"
            onClick={() => {
              dispatch(setModal({ target: 'signout' }));
            }}
          >
            <p>Cancel</p>
          </button>
          <button
            type="button"
            className="py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // close modal
              dispatch(setModal({ target: 'signout' }));
              const cache = JSON.parse(localStorage.getItem('cache'));

              delete cache.token;
              // set cache without access token
              localStorage.setItem('cache', JSON.stringify(cache));

              // reload & display auth page after 0.5s
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }}
          >
            <p className="font-bold text-white/90">Sign out</p>
          </button>
        </span>
      </div>
    </div>
  );
}

export default Logout;
