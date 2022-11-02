import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as bi from 'react-icons/bi';
import { setRoom } from '../../../redux/features/chat';
import { setPage } from '../../../redux/features/page';

function Header() {
  const dispatch = useDispatch();
  const { chat: { room }, page } = useSelector((state) => state);
  const [subtext, setSubtext] = useState('');

  const handleSubtext = () => {
    setSubtext('click here to see contact info');

    setTimeout(() => {
      const lastSeen = moment(room.profile.updatedAt).fromNow();
      setSubtext(room.profile.online ? 'online' : `last seen ${lastSeen}`);
    }, 3000);
  };

  useEffect(() => {
    handleSubtext();
  }, [room]);

  return (
    <div className="h-16 px-2 flex gap-4 items-center bg-white dark:bg-spill-900">
      <button
        type="button"
        className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
        onClick={() => dispatch(setRoom(null))}
      >
        <bi.BiArrowBack />
      </button>
      <div
        className="flex gap-4 items-center cursor-pointer"
        aria-hidden
        onClick={() => {
          if (!page.friendProfile) {
            dispatch(setPage({ target: 'friendProfile' }));
          }
        }}
      >
        <img
          src={`assets/images/${room.profile.avatar}`}
          alt={`assets/images/${room.profile.avatar}`}
          className="w-10 h-10 rounded-full"
        />
        <span className="">
          <p className="font-bold">{room.profile.fullname}</p>
          <p className="text-sm opacity-60">{subtext}</p>
        </span>
      </div>
    </div>
  );
}

export default Header;
