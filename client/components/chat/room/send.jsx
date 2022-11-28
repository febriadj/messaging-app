import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bi from 'react-icons/bi';
import socket from '../../../helpers/socket';
import EmojiBoard from './emojiBoard';
import { setModal } from '../../../redux/features/modal';
import base64Encode from '../../../helpers/base64Encode';

function Send({ setChats }) {
  const dispatch = useDispatch();
  const { user: { master }, room: { chat: chatRoom } } = useSelector((state) => state);

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

  const handleSubmit = (e) => {
    e.preventDefault();

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
          <button
            type="button"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
            onClick={() => {
              setEmojiBoard((prev) => !prev);
            }}
          >
            <i>{emojiBoard ? <bi.BiX /> : <bi.BiSmile />}</i>
          </button>
          <label htmlFor="send-photo" className="p-2 cursor-pointer rounded-full hover:bg-spill-100 dark:hover:bg-spill-800">
            <i><bi.BiImageAlt /></i>
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/webp"
              name="sendPhoto"
              id="send-photo"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files) {
                  const base64 = await base64Encode(e.target.files[0]);

                  dispatch(setModal({
                    target: 'sendFile',
                    data: {
                      type: 'image',
                      originalname: e.target.files[0].name,
                      url: base64,
                    },
                  }));
                }
              }}
            />
          </label>
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
        emojiBoard && <EmojiBoard setForm={setForm} />
      }
    </div>
  );
}

export default Send;
