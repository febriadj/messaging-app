import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import { setChatRoom } from '../../../../redux/features/room';
import { setPage } from '../../../../redux/features/page';

function Header() {
  const dispatch = useDispatch();
  const { room: { chat: chatRoom }, page } = useSelector((state) => state);

  const [subhead, setSubhead] = useState('');

  const handleGetParticipantsName = async (signal) => {
    try {
      const { data } = await axios.get('/groups/participants/name', {
        params: {
          roomId: chatRoom.data.group.roomId,
        },
        signal,
      });

      setSubhead(data.payload.join(', '));
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  const handleSubhead = (signal) => {
    setSubhead('tap here for group info');

    setTimeout(() => {
      handleGetParticipantsName(signal);
    }, 3000);
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    handleSubhead(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [chatRoom.isOpen, chatRoom.refreshId]);

  return (
    <div className="h-16 px-2 md:pl-4 flex gap-2 items-center bg-white dark:bg-spill-900">
      <button
        type="button"
        className="block md:hidden p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
        onClick={() => dispatch(setChatRoom({
          isOpen: false,
          refreshId: null,
          data: null,
        }))}
      >
        <bi.BiArrowBack />
      </button>
      <div
        className="flex gap-4 items-center cursor-pointer"
        aria-hidden
        onClick={() => {
          if (!page.groupProfile) {
            dispatch(setPage({
              target: 'groupProfile',
            }));
          }
        }}
      >
        <img
          src="assets/images/default-group-avatar.png"
          alt="assets/images/default-group-avatar.png"
          className="w-10 h-10 rounded-full"
        />
        <span className="">
          <p className="font-bold">{chatRoom.data.group.name}</p>
          <p className="text-sm opacity-60">{subhead}</p>
        </span>
      </div>
    </div>
  );
}

export default Header;
