import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import { setModal } from '../../../redux/features/modal';

function Minibox() {
  const dispatch = useDispatch();
  const { user, modal } = useSelector((state) => state);

  return (
    <div
      className={`
        ${modal.minibox ? 'opacity-100 z-10' : 'opacity-0 -z-50 scale-50'}
        transition duration-75 absolute right-0 translate-y-12 -translate-x-6 shadow-xl rounded-md
        bg-white dark:bg-spill-800 dark:text-white/90
      `}
    >
      <div className="py-2 grid">
        {
          [
            {
              target: 'profile',
              data: user.master._id,
              html: 'Profile',
              icon: <bi.BiUserCircle />,
            },
            { target: 'starred', html: 'Starred Message', icon: <bi.BiStar /> },
            { target: 'setting', html: 'Setting', icon: <bi.BiCog /> },
            { target: 'signout', html: 'Sign out', icon: <bi.BiLogOutCircle /> },
          ].map((elem) => (
            <button
              type="button"
              key={elem.target}
              className="py-2 px-4 flex gap-2 items-center hover:bg-spill-100 dark:hover:bg-spill-700"
              onClick={() => {
                dispatch(setModal({
                  target: elem.target,
                  data: elem.data ?? null,
                }));
              }}
            >
              <i className="opacity-20">{elem.icon}</i>
              <p>{elem.html}</p>
            </button>
          ))
        }
      </div>
    </div>
  );
}

export default Minibox;
