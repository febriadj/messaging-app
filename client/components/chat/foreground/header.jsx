import React from 'react';
import { useDispatch } from 'react-redux';
import * as bi from 'react-icons/bi';
import config from '../../../config';
import { setModal } from '../../../redux/features/modal';
import { setPage } from '../../../redux/features/page';

function Header() {
  const dispatch = useDispatch();

  return (
    <div className="grid items-center bg-white dark:bg-spill-900 dark:text-white/90">
      <div className="h-16 pl-4 pr-2 flex gap-5 justify-between items-center">
        {/* brand name */}
        <h1 className="text-2xl font-bold font-display">{config.brandName}</h1>
        <div className="flex">
          {
            [
              { target: 'status', icon: <bi.BiRotateLeft /> },
              { target: 'contact', icon: <bi.BiMessageSquareDots /> },
              { target: 'minibox', icon: <bi.BiDotsVerticalRounded /> },
            ].map((elem) => (
              <button
                type="button"
                key={elem.target}
                className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
                onClick={(e) => {
                  e.stopPropagation();

                  if (elem.target !== 'minibox') {
                    dispatch(setPage({ target: elem.target }));
                    dispatch(setModal({
                      target: 'minibox',
                      data: false,
                    }));
                  } else {
                    dispatch(setModal({ target: elem.target }));
                  }
                }}
              >
                {elem.icon}
              </button>
            ))
          }
        </div>
      </div>
      {/* search bar */}
      <div className="px-4 pb-4">
        <label htmlFor="search" className="flex gap-3 items-center">
          <bi.BiSearchAlt />
          <input
            type="text"
            name="search"
            id="search"
            className="w-full placeholder:opacity-80"
            placeholder="Search chat or group in inbox"
          />
        </label>
      </div>
    </div>
  );
}

export default Header;
