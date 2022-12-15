import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import socket from '../../../helpers/socket';
import EmojiBoard from './emojiBoard';
import { setModal } from '../../../redux/features/modal';

import AttachMenu from '../../modals/attachMenu';

function Send({ setChats, setNewMessage }) {
  const dispatch = useDispatch();
  const { user: { master, setting }, room: { chat: chatRoom } } = useSelector((state) => state);

  const isGroup = chatRoom.data.roomType === 'group';

  const [emojiBoard, setEmojiBoard] = useState(false);
  const [form, setForm] = useState({
    text: '',
    file: null,
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // set typing status
    socket.emit('chat/typing', {
      roomId: chatRoom.data.roomId,
      userId: master._id,
    });
  };

  const handleSubmit = () => {
    if (form.text.length > 0 || form.file) {
      if (isGroup || (!isGroup && chatRoom.data.profile.active)) {
        socket.emit('chat/insert', {
          ...form,
          ownersId: chatRoom.data.ownersId,
          roomType: chatRoom.data.roomType,
          userId: master._id,
          roomId: chatRoom.data.roomId,
        });
      } else return;

      // close emoji board after 150ms
      setTimeout(() => setEmojiBoard(false), 150);
      // reset form
      setForm({ text: '', file: null });
    }
  };

  useEffect(() => {
    socket.on('chat/insert', (payload) => {
      if (chatRoom.isOpen) {
        // push new chat to state.chats
        setChats((prev) => {
          if (prev) {
            return [...prev, payload];
          }
          return [payload];
        });
      }

      setTimeout(() => {
        const monitor = document.querySelector('#monitor');

        if (payload.userId === master._id) {
          monitor.scrollTo({
            top: monitor.scrollHeight,
            behavior: 'smooth',
          });

          return;
        }

        if (
          (monitor.scrollHeight - monitor.clientHeight)
          >= (monitor.scrollTop + monitor.clientHeight / 2)
        ) {
          setNewMessage((prev) => prev + 1);
        } else {
          monitor.scrollTo({
            top: monitor.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 150);
    });

    return () => {
      socket.off('chat/insert');
    };
  }, []);

  return (
    <div className="bg-white dark:bg-spill-900">
      <AttachMenu />
      <div className="px-2 h-16 grid grid-cols-[auto_1fr_auto] gap-2 items-center">
        <span className="flex">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
            onClick={() => {
              setEmojiBoard((prev) => !prev);
            }}
          >
            <i>{emojiBoard ? <bi.BiX /> : <bi.BiSmile />}</i>
          </button>
          <button
            type="button"
            className="p-2 rounded-full -rotate-90 hover:bg-spill-100 dark:hover:bg-spill-800"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setModal({ target: 'attachMenu' }));
            }}
          >
            <i><bi.BiPaperclip /></i>
          </button>
        </span>
        <input
          type="text"
          name="text"
          id="new-message"
          placeholder="Type message"
          className="py-4 w-full h-full placeholder:opacity-60"
          onChange={handleChange}
          value={form.text}
          onKeyPress={(e) => {
            if (setting.enterToSend && e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <button
          type="submit"
          className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
          onClick={(e) => {
            if (form.text.length > 0) {
              handleSubmit(e);
            }
          }}
        >
          {
            form.text.length > 0
              ? <i><bi.BiSend /></i>
              : <i><bi.BiMicrophone /></i>
          }
        </button>
      </div>
      {
        emojiBoard && <EmojiBoard setForm={setForm} />
      }
    </div>
  );
}

export default Send;
