import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import { setModal } from '../../../redux/features/modal';

function Profile() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [profile, setProfile] = useState(null);

  const handleGetProfile = async (signal) => {
    try {
      // get profile if profile modal is opened
      if (modal.profile) {
        const { data } = await axios.get('/profiles', {
          params: { userId: modal.profile },
          signal,
        });

        setProfile(data.payload);
      } else {
        // destroy when modal is closed
        setTimeout(() => setProfile(null), 150);
      }
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    handleGetProfile(ctrl.signal);

    return () => {
      ctrl.abort();
    };
  }, [modal.profile]);

  return (
    <div
      className={`
        ${modal.profile ? 'delay-75' : '-translate-x-full'}
        transition duration-200 absolute w-full h-full z-10 grid grid-rows-[auto_1fr] overflow-hidden
        bg-white dark:bg-spill-900 dark:text-white/90
      `}
    >
      {/* header */}
      <div className="p-4 flex gap-6 items-center">
        <button
          type="button"
          onClick={() => {
            dispatch(setModal({ target: 'profile' }));
          }}
        >
          <bi.BiArrowBack />
        </button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      {
        profile && (
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
            <div className="p-4 flex flex-col items-center">
              <img src={`assets/images/${profile.avatar}`} alt="" className="w-28 h-28 rounded-full" />
              <div className="w-full text-center mt-4 overflow-hidden">
                <h1 className="text-2xl font-bold mb-1">{profile.fullname}</h1>
                <p>{profile.online ? 'online' : 'offline'}</p>
              </div>
            </div>
            <div className="grid">
              {
                [
                  { label: 'Pin', data: profile.pin, icon: <bi.BiKey /> },
                  { label: 'Bio', data: profile.bio, icon: <bi.BiInfoCircle /> },
                  { label: 'Phone', data: profile.phone.number, icon: <bi.BiPhone /> },
                  { label: 'Email', data: profile.email, icon: <bi.BiEnvelope /> },
                ]
                  .map((elem) => (
                    <div key={elem.label} className="py-2 px-4 grid grid-cols-[auto_1fr_auto] gap-4 items-start border-0 border-b border-solid border-spill-100 dark:border-spill-800">
                      <i>{elem.icon}</i>
                      <span>
                        <p className="text-sm opacity-60 mb-0.5">{elem.label}</p>
                        <p>{elem.data}</p>
                      </span>
                      { elem.label === 'Pin' && (
                        <button type="button" className="p-1 rounded-md bg-spill-100 hover:bg-spill-200 dark:bg-spill-800 dark:hover:bg-spill-700">
                          <bi.BiQr />
                        </button>
                      ) }
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

export default Profile;
