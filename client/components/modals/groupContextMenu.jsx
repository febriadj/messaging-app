import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../../redux/features/page';
import { setModal } from '../../redux/features/modal';

function GroupContextMenu() {
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.modal.groupContextMenu);

  return (
    <div
      id="group-context-menu"
      className="absolute left-0 top-0 z-10 w-40 py-2 rounded-md shadow-xl translate-x-12 -translate-y-14 bg-white dark:bg-spill-700"
      aria-hidden
      onClick={(e) => e.stopPropagation()}
      style={{
        transform: `translate(${menu.x}px, ${menu.y}px)`,
      }}
    >
      <div className="grid">
        {
          [
            {
              _key: 'B-01',
              html: `View ${menu.user.fullname.split(' ')[0]}`,
              func() {
                const data = menu.user.userId;
                dispatch(setPage({ target: 'friendProfile', data }));
              },
            },
            {
              _key: 'B-02',
              html: menu.currentAdminId === menu.user.userId ? 'Dismiss as admin' : 'Set as admin',
              func: null,
            },
            {
              _key: 'B-03',
              html: `Remove ${menu.user.fullname.split(' ')[0]}`,
              func: null,
            },
          ].map((elem) => (
            <button
              key={elem._key}
              type="button"
              className="py-2 px-4 overflow-hidden flex gap-4 items-center cursor-pointer hover:bg-spill-200 dark:hover:bg-spill-600"
              onClick={() => {
                dispatch(setModal({ target: 'groupContextMenu', data: false }));

                setTimeout(() => elem.func(), 150);
              }}
            >
              <p className="truncate">{elem.html}</p>
            </button>
          ))
        }
      </div>
    </div>
  );
}

export default GroupContextMenu;
