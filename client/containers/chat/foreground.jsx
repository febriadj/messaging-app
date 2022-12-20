import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import * as fg from '../../components/chat/foreground';
import * as page from '../../pages';

function ForeGround() {
  const chatRoom = useSelector((state) => state.room.chat);
  const refreshInbox = useSelector((state) => state.chore.refreshInbox);

  const [inboxs, setInboxs] = useState(null);
  const [search, setSearch] = useState('');

  const handleGetInboxs = async (signal) => {
    try {
      setInboxs(null);

      const { data } = await axios.get('/inboxs', { params: { search }, signal });
      setInboxs(data.payload);
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    handleGetInboxs(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [refreshInbox, search]);

  return (
    <div className={`${chatRoom.isOpen && '-translate-x-full md:translate-x-0'} transition w-full h-full relative z-10 grid grid-rows-[auto_1fr] overflow-hidden`}>
      {
        // loading animation
        !inboxs && (
          <div className="absolute w-full h-full z-0 flex justify-center items-center bg-white dark:bg-spill-900">
            <span className="flex gap-2 items-center">
              <i className="animate-spin"><bi.BiLoaderAlt size={18} /></i>
              <p>Loading</p>
            </span>
          </div>
        )
      }
      <page.setting />
      <page.contact />
      <page.profile />
      <page.selectParticipant />

      <fg.minibox />
      <fg.openContact />
      <fg.header setSearch={setSearch} />
      <fg.inbox inboxs={inboxs} setInboxs={setInboxs} />
    </div>
  );
}

export default ForeGround;
