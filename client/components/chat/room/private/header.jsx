import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as bi from 'react-icons/bi';
import { setChatRoom } from '../../../../redux/features/room';
import { setPage } from '../../../../redux/features/page';
import socket from '../../../../helpers/socket';

function Header() {
  const dispatch = useDispatch();
  const { room: { chat: chatRoom }, page } = useSelector((state) => state);
  const [subhead, setSubhead] = useState('');

  const handleSubhead = () => {
    setSubhead('tap here for contact info');

    setTimeout(() => {
      const lastSeen = moment(chatRoom.data.profile.updatedAt).fromNow();
      setSubhead(
        chatRoom.data.profile.online
          ? 'online'
          : `last seen ${lastSeen}`,
      );
    }, 3000);
  };

  useEffect(() => {
    handleSubhead();
  }, [chatRoom.isOpen, chatRoom.refreshId]);

  const setOnlineStatus = (args) => {
    dispatch(setChatRoom({
      isOpen: true,
      refreshId: chatRoom.refreshId,
      data: {
        ...chatRoom.data,
        profile: {
          ...chatRoom.data.profile,
          ...args,
        },
      },
    }));
  };

  useEffect(() => {
    // user online
    socket.on('user/connect', (userId) => {
      if (userId === chatRoom.data.profile.userId) {
        setSubhead('online');
        setOnlineStatus({ online: true });
      }
    });

    // user offline
    socket.on('user/disconnect', (userId) => {
      if (userId === chatRoom.data.profile.userId) {
        const updatedAt = new Date().toISOString();

        setSubhead(`last seen ${moment(updatedAt).fromNow()}`);
        setOnlineStatus({
          online: false,
          updatedAt,
        });
      }
    });

    return () => {
      socket.off('user/connect');
      socket.off('user/disconnect');
    };
  }, []);

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
          if (chatRoom.data.profile.active && !page.friendProfile) {
            dispatch(setPage({
              target: 'friendProfile',
            }));
          }
        }}
      >
        <img
          src={chatRoom.data.profile.avatar}
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <span className="">
          <p className="font-bold">{chatRoom.data.profile.fullname}</p>
          <p className="text-sm opacity-60">{subhead}</p>
        </span>
      </div>
    </div>
  );
}

export default Header;
