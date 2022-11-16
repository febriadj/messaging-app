import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import { setPage } from '../../../../redux/features/page';

function GroupProfile() {
  const dispatch = useDispatch();
  const { user: { master }, chat: { room: { group } }, page } = useSelector((state) => state);

  const [peoples, setPeoples] = useState(null);

  const handleGetParticipants = async (signal) => {
    try {
      if (page.groupProfile) {
        const { data } = await axios.get('/groups/participants', {
          params: {
            roomId: group.roomId,
          },
          signal,
        });

        setPeoples(data.payload);
      } else {
        setTimeout(() => {
          setPeoples(null);
        }, 150);
      }
    }
    catch (error0) {
      console.error(error0);
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    handleGetParticipants(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [page.groupProfile]);

  return (
    <div
      className={`
        ${!page.groupProfile && 'translate-x-full'}
        transition absolute w-full sm:w-[380px] h-full right-0 grid grid-rows-[auto_1fr] overflow-hidden
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
              dispatch(setPage({ target: 'groupProfile' }));
            }}
          >
            <bi.BiArrowBack className="block md:hidden" />
            <bi.BiX className="hidden md:block" />
          </button>
          <h1 className="text-2xl font-bold">Group Info</h1>
        </div>
      </div>
      {
        group && (
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
            <div className="p-4 flex flex-col items-center">
              <img
                src="assets/images/default-avatar.png"
                alt="assets/images/default-avatar.png"
                className="w-28 h-28 rounded-full"
              />
              <div className="w-full text-center mt-4 overflow-hidden">
                <h1 className="text-2xl font-bold break-all mb-1">{group.name}</h1>
                <p className="text-sm opacity-60">Group</p>
              </div>
            </div>
            <div className="grid">
              {
                [
                  { label: 'Description', data: group.desc, icon: <bi.BiInfoCircle /> },
                  { label: 'Invite Link', data: group.link.slice(group.link.indexOf('group'), group.link.length), icon: <bi.BiLinkAlt /> },
                ]
                  .map((elem) => (
                    <div key={elem.label} className="py-2 px-4 grid grid-cols-[auto_1fr_auto] gap-4 items-start border-0 border-b border-solid border-spill-100 dark:border-spill-800">
                      <i>{elem.icon}</i>
                      <span>
                        <p className="text-sm opacity-60 mb-1">{elem.label}</p>
                        <p className="break-all">{elem.data}</p>
                      </span>
                    </div>
                  ))
              }
            </div>
            <div>
              <div className="mt-6 px-4 flex gap-4 justify-between">
                <p className="opacity-60">{`${peoples?.length} participants`}</p>
                <i><bi.BiSearchAlt /></i>
              </div>
              <div className="grid">
                {
                  peoples && peoples.map((elem) => (
                    <div
                      key={elem._id}
                      className={`
                        p-4 grid grid-cols-[auto_1fr] gap-4 items-center cursor-default
                        border-0 border-b border-solid border-spill-200 dark:border-spill-800
                        hover:bg-spill-100/60 dark:hover:bg-spill-800/60
                      `}
                    >
                      <img src="assets/images/default-avatar.png" alt="assets/images/default-avatar.png" className="w-14 h-14 rounded-full" />
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
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default GroupProfile;
