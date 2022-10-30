import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import socket from '../../../helpers/socket';
import * as comp from './sub';

function Send({ setChats }) {
  const { user: { master }, chat: { room } } = useSelector((state) => state);

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
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      socket.emit('chat/insert', {
        ...form,
        ownersId: room.ownersId,
        userId: master._id,
        roomId: room.roomId,
      });

      // reset form
      setForm({ text: '', file: null });
      setTimeout(() => {
        setEmojiBoard(false);
      }, 150);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    socket.on('chat/insert', (payload) => {
      if (room) {
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
        monitor.scrollTo({
          top: monitor.scrollHeight,
          behavior: 'smooth',
        });
      }, 150);
    });

    return () => {
      socket.off('chat/insert');
    };
  }, []);

  return (
    <div className="bg-white dark:bg-spill-900">
      <div className="px-2 h-16 grid grid-cols-[auto_1fr_auto] gap-2 items-center">
        <span className="flex">
          {
            [
              emojiBoard ? { target: 'x', icon: <bi.BiX /> } : { target: 'emojiBoard', icon: <bi.BiSmile /> },
              { target: 'file', icon: <bi.BiImageAlt /> },
            ].map((elem) => (
              <button
                type="button"
                key={elem.target}
                className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
                onClick={() => {
                  setEmojiBoard((prev) => !prev);
                }}
              >
                <i>{elem.icon}</i>
              </button>
            ))
          }
        </span>
        <input
          type="text"
          name="text"
          id="new-message"
          placeholder="Type message"
          className="py-4 w-full h-full placeholder:opacity-60"
          onChange={handleChange}
          value={form.text}
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
        emojiBoard && <comp.emojiBoard setForm={setForm} />
      }
    </div>
  );
}

export default Send;
