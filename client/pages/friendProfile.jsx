import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import { setPage } from '../redux/features/page';
import { setModal } from '../redux/features/modal';

function FriendProfile() {
  const dispatch = useDispatch();
  const { page: { friendProfile } } = useSelector((state) => state);

  const [profile, setProfile] = useState(null);

  const handleGetProfile = async (signal) => {
    try {
      // get profile if profile page is opened
      if (friendProfile) {
        const { data } = await axios.get('/profiles', {
          params: { userId: friendProfile },
          signal,
        });

        setProfile(data.payload);
      } else {
        // reset when profile page is closed after 150ms
        setTimeout(() => setProfile(null), 150);
      }
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    handleGetProfile(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [friendProfile]);

  return (
    <div
      className={`
        ${!friendProfile && 'translate-x-full'}
        transition absolute w-full sm:w-[380px] h-full right-0 z-20 grid grid-rows-[auto_1fr] overflow-hidden
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
              dispatch(setPage({ target: 'friendProfile' }));
            }}
          >
            <bi.BiArrowBack className="block md:hidden" />
            <bi.BiX className="hidden md:block" />
          </button>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </div>
      {
        profile && (
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
            <div className="p-4 flex flex-col items-center">
              <img
                src={profile.avatar}
                alt=""
                className="w-28 h-28 rounded-full cursor-pointer hover:brightness-75"
                aria-hidden
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setModal({ target: 'photoFull', data: profile.avatar }));
                }}
              />
              <div className="w-full text-center mt-4 overflow-hidden">
                <h1 className="text-2xl font-bold break-all mb-1">{profile.fullname}</h1>
                <p className="text-sm opacity-60">{profile.online ? 'online' : `last seen ${moment(profile.updatedAt).fromNow()}`}</p>
              </div>
            </div>
            <div className="grid">
              {
                [
                  { label: 'Username', data: profile.username, icon: <bi.BiAt /> },
                  { label: 'Bio', data: profile.bio, icon: <bi.BiInfoCircle /> },
                  { label: 'Phone', data: profile.phone, icon: <bi.BiPhone /> },
                  { label: 'Email', data: profile.email, icon: <bi.BiEnvelope /> },
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
          </div>
        )
      }
    </div>
  );
}

export default FriendProfile;
