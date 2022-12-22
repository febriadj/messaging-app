import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import { setPage } from '../redux/features/page';

function GroupParticipant() {
  const dispatch = useDispatch();
  const { user: { master }, page: { groupParticipant } } = useSelector((state) => state);

  const [control, setControl] = useState({ skip: 0, limit: 40 });
  const [participants, setParticipants] = useState(null);

  const handleGetParticipants = async (signal) => {
    try {
      if (groupParticipant) {
        // get participants with pagination control
        const { data } = await axios.get(`/groups/${groupParticipant.groupId}/participants`, { params: control, signal });

        setParticipants((prev) => {
          // merge new participants data
          if (prev) return [...prev, ...data.payload];
          return data.payload;
        });
      } else {
        // reset participants element
        setTimeout(() => setParticipants(null), 150);
      }
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    handleGetParticipants(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [groupParticipant, control]);

  return (
    <div
      className={`
        ${!groupParticipant && 'translate-x-full'}
        transition absolute w-full sm:w-[380px] h-full right-0 z-10 grid grid-rows-[auto_1fr] overflow-hidden
        bg-white dark:bg-spill-900
      `}
    >
      {/* header */}
      <div className="h-16 px-2 flex gap-6 justify-between items-center">
        <div className="flex gap-4 items-center">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
            onClick={() => {
              setControl({ skip: 0, limit: 40 });
              dispatch(setPage({ target: 'groupParticipant' }));
            }}
          >
            <bi.BiArrowBack className="block md:hidden" />
            <bi.BiX className="hidden md:block" />
          </button>
          <h1 className="text-2xl font-bold">Participants</h1>
        </div>
      </div>
      <div className="pb-16 md:pb-0 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
        {
          participants && participants.map((elem) => (
            <div
              key={elem._id}
              className={`
                p-4 grid grid-cols-[auto_1fr] gap-4 items-center cursor-pointer
                border-0 border-b border-solid border-spill-200 dark:border-spill-800
                hover:bg-spill-100/60 dark:hover:bg-spill-800/60
              `}
              aria-hidden
              onClick={() => {
                if (master._id !== elem.userId) {
                  dispatch(setPage({
                    target: 'friendProfile',
                    data: elem.userId,
                  }));
                }
              }}
            >
              <img src={elem.avatar} alt="" className="w-14 h-14 rounded-full" />
              <span className="truncate">
                <h1 className="truncate text-lg font-bold">
                  {elem.fullname}
                  <sup className="ml-1 opacity-60">{master._id === elem.userId && '~You'}</sup>
                </h1>
                <p className="truncate mt-0.5 opacity-60">{elem.bio}</p>
              </span>
            </div>
          ))
        }
        {
          participants && participants.length < groupParticipant.totalParticipants && (
            <button
              type="button"
              className="mb-6 py-2 px-4 flex gap-4 hover:bg-spill-800"
              onClick={() => {
                setControl((prev) => ({
                  ...prev,
                  skip: participants.length,
                }));
              }}
            >
              <i><bi.BiChevronDown /></i>
              <p>{`${groupParticipant.totalParticipants - participants.length} more`}</p>
            </button>
          )
        }
      </div>
    </div>
  );
}

export default GroupParticipant;
