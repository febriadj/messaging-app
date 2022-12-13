import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as md from 'react-icons/md';

import { setModal } from '../../redux/features/modal';
import { setSelectedChats } from '../../redux/features/chore';
import socket from '../../helpers/socket';

import * as comp from '../../components/chat/room';
import FriendProfile from '../../pages/friendProfile';
import GroupProfile from '../../pages/groupProfile';
import GroupParticipant from '../../pages/groupParticipant';
import AddParticipant from '../../pages/addParticipant';

import { setPage } from '../../redux/features/page';

function Room() {
  const dispatch = useDispatch();
  const { room: { chat: chatRoom }, page } = useSelector((state) => state);

  const [loaded, setLoaded] = useState(false);
  const [chats, setChats] = useState(null);

  const handleGetChats = async (signal) => {
    try {
      setLoaded(false);
      setChats(null);
      dispatch(setSelectedChats([]));

      // get chats if room is opened
      if (chatRoom.isOpen) {
        const { data } = await axios.get('/chats', {
          params: { roomId: chatRoom.data.roomId },
          signal,
        });

        if (data.payload.length > 0) {
          setChats(data.payload);
        }

        setTimeout(() => {
          const monitor = document.querySelector('#monitor');
          monitor.scrollTop = monitor.scrollHeight;

          setLoaded(true);
        }, 150);
      }
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  const [prevRoom, setPrevRoom] = useState(null);
  const handleOpenRoom = () => {
    if (chatRoom.isOpen) {
      socket.emit('room/open', {
        prevRoom,
        newRoom: chatRoom.data.roomId,
      });
    }

    dispatch(setPage({ target: 'friendProfile', data: false }));
    dispatch(setPage({ target: 'groupProfile', data: false }));
  };

  useEffect(() => {
    const abortCtrl = new AbortController();

    handleOpenRoom();
    handleGetChats(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [chatRoom.isOpen, chatRoom.refreshId]);

  useEffect(() => {
    socket.on('room/open', (args) => setPrevRoom(args));

    socket.on('chat/delete', (chatsId) => {
      dispatch(setSelectedChats([]));
      // close confirmDeleteChat modal
      dispatch(setModal({
        target: 'confirmDeleteChat',
        data: false,
      }));

      setTimeout(() => {
        setChats((prev) => prev.filter(({ _id }) => !chatsId.includes(_id)));
      }, 300);
    });

    return () => {
      socket.off('room/open');
      socket.off('chat/delete');
    };
  }, []);

  return (
    <div
      className={`
        ${!chatRoom.data && 'translate-x-full md:translate-x-0'}
        transition absolute md:relative flex z-10 w-full h-full overflow-hidden
        bg-spill-100 dark:bg-spill-950
      `}
    >
      {
        chatRoom.data && (
          <>
            <div className={`${(page.groupProfile || page.friendProfile) && '-translate-x-full sm:translate-x-0 xl:mr-[380px]'} transition-all w-full h-full grid grid-rows-[auto_1fr_auto] overflow-hidden`}>
              <comp.header />
              <comp.monitor loaded={loaded} chats={chats} setChats={setChats} />
              <comp.send setChats={setChats} />
            </div>
            <GroupProfile />
            <FriendProfile />
            <GroupParticipant />
            <AddParticipant />
          </>
        )
      }
      {
        !chatRoom.data && (
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
