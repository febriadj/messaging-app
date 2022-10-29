import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as comp from '../../components/chat/room';
import socket from '../../helpers/socket';

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

      socket.on('room/join', (args) => {
        setPrevRoom(args);
      });
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();

    handleJoinRoom();
    handleGetChats(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
      socket.off('room/join');
    };
  }, [room]);

  return (
    <div
      className={`
        ${!room && 'translate-x-full md:translate-x-0'}
        transition absolute md:relative flex z-10 w-full h-full overflow-hidden
        bg-spill-100 dark:bg-spill-950
      `}
    >
      {
        room && (
          <>
            <div className={`${page.friendProfile && '-translate-x-full md:translate-x-0 xl:mr-[380px]'} transition-all w-full h-full grid grid-rows-[auto_1fr_auto] overflow-hidden`}>
              <comp.header />
              <comp.monitor chats={chats} setChats={setChats} />
              <comp.send setChats={setChats} />
            </div>
            <comp.friendProfile />
          </>
        )
      }
    </div>
  );
}

export default Room;
