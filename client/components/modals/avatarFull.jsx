import React from 'react';
import { useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';

function AvatarFull() {
  const avatar = useSelector((state) => state.modal.avatarFull);

  return (
    <div
      className={`
        ${avatar ? 'z-50' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full grid grid-rows-[auto_1fr_auto]
        bg-spill-600/80 dark:bg-black/80
      `}
    >
      <div className="h-16 px-2 flex justify-end items-center bg-spill-black/90">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-700"
        >
          <i><bi.BiX /></i>
        </button>
      </div>
      <div className="flex justify-center items-center">
        <img
          src={avatar || ''}
          alt=""
          aria-hidden
          className={`${avatar ? 'scale-100' : 'scale-0'} transition w-[460px]`}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="h-16"></div>
    </div>
  );
}

export default AvatarFull;
