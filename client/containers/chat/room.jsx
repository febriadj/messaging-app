import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as md from 'react-icons/md';
import * as pChat from '../../components/chat/room/private';
import * as gChat from '../../components/chat/room/group';

import socket from '../../helpers/socket';
// pages
import FriendProfile from '../../pages/friendProfile';
import GroupProfile from '../../pages/groupProfile';

function Room() {
  const { chat: { room }, page } = useSelector((state) => state);
  const [chats, setChats] = useState(null);

  const handleGetChats = async (signal) => {
    try {
      setChats(null);

      // get chats if room is opened
      if (room) {
        const { data } = await axios.get('/chats', {
          params: { roomId: room.roomId },
          signal,
        });

        if (data.payload.length > 0) {
          setChats(data.payload);
        }

        setTimeout(() => {
          const monitor = document.querySelector('#monitor');
          monitor.scrollTo({
            top: monitor.scrollHeight,
            behavior: 'smooth',
          });
        }, 500);
      }
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  const [prevRoom, setPrevRoom] = useState(null);
  const handleJoinRoom = () => {
    if (room) {
      socket.emit('room/join', {
        prevRoom,
        newRoom: room.roomId,
      });
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();

    handleJoinRoom();
    handleGetChats(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [room]);

  useEffect(() => {
    socket.on('room/join', (args) => {
      setPrevRoom(args);
    });

    return () => {
      socket.off('room/join');
    };
  }, []);

  return (
    <div
      className={`
        ${!room && 'translate-x-full md:translate-x-0'}
        transition absolute md:relative flex z-10 w-full h-full overflow-hidden
        bg-spill-100 dark:bg-spill-950
      `}
    >
      {
        room && room.roomType === 'private' && (
          <>
            <div className={`${page.friendProfile && '-translate-x-full md:translate-x-0 xl:mr-[380px]'} transition-all w-full h-full grid grid-rows-[auto_1fr_auto] overflow-hidden`}>
              <pChat.header />
              <pChat.monitor chats={chats} setChats={setChats} />
              <pChat.send setChats={setChats} />
            </div>
            <FriendProfile />
          </>
        )
      }
      {
        room && room.roomType === 'group' && (
          <>
            <div className={`${page.groupProfile && '-translate-x-full md:translate-x-0 xl:mr-[380px]'} transition-all w-full h-full grid grid-rows-[auto_1fr_auto] overflow-hidden`}>
              <gChat.header />
              <gChat.monitor chats={chats} setChats={setChats} />
              <gChat.send setChats={setChats} />
            </div>
            <GroupProfile />
          </>
        )
      }
      {
        !room && (
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-[400px] flex flex-col items-center">
              <i className="opacity-40"><md.MdDevices size={140} /></i>
              <p className="mt-4 opacity-60 text-center">You can use Spillgram on other devices such as desktop, tablet, and mobile phone.</p>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Room;
