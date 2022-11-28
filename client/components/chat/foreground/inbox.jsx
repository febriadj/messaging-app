import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import * as ri from 'react-icons/ri';
import socket from '../../../helpers/socket';
import { setChatRoom } from '../../../redux/features/room';

function Inbox() {
  const dispatch = useDispatch();
  const { user: { master }, room: { chat: chatRoom } } = useSelector((state) => state);
  const [inboxs, setInboxs] = useState(null);

  const handleGetInboxs = async (signal) => {
    try {
      const { data } = await axios.get('/inboxs', { signal });
      setInboxs(data.payload);
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    handleGetInboxs(abortCtrl.signal);

    socket.on('inbox/find', (payload) => {
      // concat old inboxs data with new data
      setInboxs((prev) => {
        const olds = prev.filter((elem) => elem._id !== payload._id);
        return [payload, ...olds];
      });

      if (payload.content.from !== master._id) {
        const audio = new Audio('assets/sound/default-ringtone.mp3');
        audio.volume = 1;

        audio.play();
      }
    });

    socket.on('inbox/read', (payload) => {
      setInboxs((prev) => {
        const index = prev.findIndex((elem) => elem._id === payload._id);
        prev.splice(index, 1, payload);

        return [...prev];
      });
    });

    socket.on('group/create', (payload) => {
      setInboxs((prev) => [payload, ...prev]);
    });

    return () => {
      abortCtrl.abort();

      socket.off('group/create');
      socket.off('inbox/find');
      socket.off('inbox/read');
    };
  }, []);

  return (
    <div className="-z-10 flex flex-col overflow-y-auto dark:bg-spill-900 scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
      {
        inboxs && inboxs.map((elem) => (
          <div
            key={elem._id}
            aria-hidden
            className={`
              ${chatRoom.data?.roomId === elem.roomId && 'bg-spill-100/60 dark:bg-spill-800/60'}
              p-4 grid grid-cols-[auto_1fr] gap-4 items-center cursor-default
              border-0 border-b border-solid border-spill-200 dark:border-spill-800
              hover:bg-spill-100/60 dark:hover:bg-spill-800/60
            `}
            onClick={() => {
              if (chatRoom.data?.roomId !== elem.roomId) {
                if (elem.roomType === 'private') {
                  const profile = elem.owners.find((x) => x.userId !== master._id);

                  dispatch(setChatRoom({
                    isOpen: true,
                    refreshId: elem.roomId,
                    data: {
                      ...elem,
                      profile: !profile
                        ? {
                          avatar: 'assets/images/default-avatar.png',
                          fullname: '[inactive]',
                          updatedAt: new Date().toISOString(),
                          active: false,
                        }
                        : {
                          ...profile,
                          active: true,
                        },
                    },
                  }));
                } else {
                  dispatch(setChatRoom({
                    isOpen: true,
                    refreshId: elem.roomId,
                    data: elem,
                  }));
                }
              }
            }}
          >
            <img
              src={
                elem.roomType === 'private'
                  ? elem.owners.find((x) => x.userId !== master._id)?.avatar || 'assets/images/default-avatar.png'
                  : 'assets/images/default-group-avatar.png'
              }
              alt=""
              className="w-14 h-14 rounded-full"
            />
            <div className="overflow-hidden grid gap-0.5">
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <p className="text-lg font-bold truncate">
                  {
                    elem.roomType === 'private'
                      ? elem.owners.find((x) => x.userId !== master._id)?.fullname || '[inactive]'
                      : elem.group.name
                  }
                </p>
                <p className="text-sm opacity-60">{moment(elem.content.time).fromNow()}</p>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                <span className="flex gap-1 items-center overflow-hidden">
                  { elem.content.from === master._id && (
                    <i>
                      {
                        elem.unreadMessage === 0
                          ? <ri.RiCheckDoubleFill size={20} className="text-sky-600 dark:text-sky-400" />
                          : <ri.RiCheckFill size={20} />
                      }
                    </i>
                  ) }
                  <span className="truncate flex gap-1 items-center">
                    { elem.roomType === 'group' && <p className="mr-1">{`${elem.content.senderName}:`}</p> }
                    { elem.file && elem.file.type === 'image' && <img src={elem.file.url} alt="" className="h-5" /> }

                    <p className="truncate">{elem.content.text}</p>
                  </span>
                </span>
                {
                  ((elem.content.from !== master._id) && elem.unreadMessage > 0) && (
                    <span className="w-5 h-5 flex justify-center items-center rounded-full bg-spill-200 dark:bg-spill-700">
                      <p className="text-sm">{elem.unreadMessage}</p>
                    </span>
                  )
                }
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default Inbox;
