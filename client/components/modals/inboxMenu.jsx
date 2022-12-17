import React from 'react';
import { useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';

function InboxMenu() {
  const inboxMenu = useSelector((state) => state.modal.inboxMenu);

  return (
    <div
      id="inbox-context-menu"
      className="absolute left-0 top-0 z-10 w-40 py-2 rounded-md shadow-xl translate-x-12 -translate-y-14 bg-white dark:bg-spill-700"
      aria-hidden
      onClick={(e) => e.stopPropagation()}
      style={{
        transform: `translate(${inboxMenu.x}px, ${inboxMenu.y}px)`,
      }}
    >
      <div className="grid">
        {
          [
            { target: 'Mute', icon: <bi.BiBellOff /> },
            { target: 'Archive', icon: <bi.BiArchive /> },
            { target: 'Delete', icon: <bi.BiTrashAlt /> },
          ].map((elem) => (
            <button
              key={elem.target}
              type="button"
              className="py-2 px-4 flex gap-4 items-center cursor-pointer hover:bg-spill-200 dark:hover:bg-spill-600"
            >
              <i className="opacity-80">{elem.icon}</i>
              <p>{elem.target}</p>
            </button>
          ))
        }
      </div>
    </div>
  );
}

export default InboxMenu;
