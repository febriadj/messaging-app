import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../helpers/socket';

function Room() {
  const room = useSelector((state) => state.chat.room);

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
    handleJoinRoom();
    return () => {
      socket.off('room/join');
    };
  }, [room]);

  return (
    <div className="relative overflow-hidden flex bg-spill-100 dark:bg-spill-950">
      {
        room && (
          <div className="z-10 w-full h-full grid grid-rows-[auto_1fr_auto]">
            <p>Chat room</p>
          </div>
        )
      }
    </div>
  );
}

export default Room;
