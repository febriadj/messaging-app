import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

function Header() {
  const room = useSelector((state) => state.chat.room);
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
    <div className="h-16 px-4 flex items-center bg-white dark:bg-spill-900">
      <div className="flex gap-4 items-center">
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
