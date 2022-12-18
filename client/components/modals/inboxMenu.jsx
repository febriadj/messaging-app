import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import { setModal } from '../../redux/features/modal';

function InboxMenu() {
  const dispatch = useDispatch();
  const inboxMenu = useSelector((state) => state.modal.inboxMenu);

  const isGroup = inboxMenu.roomType === 'group';

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
            {
              target: isGroup ? 'Exit group' : 'Delete',
              icon: isGroup ? <bi.BiExit /> : <bi.BiTrashAlt />,
              action() {
                if (!isGroup) {
                  dispatch(setModal({
                    target: 'confirmDeleteChatAndInbox',
                    data: {
                      inboxId: inboxMenu.inboxId,
                      roomId: inboxMenu.roomId,
                    },
                  }));
                } else {
                  dispatch(setModal({
                    target: 'confirmExitGroup',
                    data: {
                      groupId: inboxMenu.group._id,
                      name: inboxMenu.group.name,
                    },
                  }));
                }
              },
            },
          ].map((elem) => (
            <button
              key={elem.target}
              type="button"
              className="py-2 px-4 flex gap-4 items-center cursor-pointer hover:bg-spill-200 dark:hover:bg-spill-600"
              onClick={(e) => {
                e.stopPropagation();
                elem.action();
              }}
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
