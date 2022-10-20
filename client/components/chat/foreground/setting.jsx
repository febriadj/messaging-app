import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import { setModal } from '../../../redux/features/modal';

function Setting() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [setting, setSetting] = useState(null);

  const structure = [
    {
      section: '',
      child: [
        {
          target: 'dark',
          title: 'Dark mode',
          desc: null,
          toggle: true,
          icon: <bi.BiAdjust />,
        },
      ],
    },
    {
      section: 'Account',
      child: [
        {
          target: 'lock',
          title: 'Lock',
          desc: 'Make others people unable to add your contact.',
          toggle: true,
          icon: <bi.BiLockOpenAlt />,
        },
        {
          target: 'changePass',
          title: 'Change password',
          desc: null,
          toggle: false,
          icon: <bi.BiKey />,
        },
        {
          target: 'delete',
          title: 'Delete account',
          desc: null,
          toggle: false,
          icon: <bi.BiPowerOff />,
        },
      ],
    },
    {
      section: 'Chat',
      child: [
        {
          target: 'enterToSend',
          title: 'Enter to send message',
          desc: null,
          toggle: true,
          icon: <bi.BiPaperPlane />,
        },
        {
          target: 'keepArchived',
          title: 'Keep archived',
          desc: 'Archived chat stay in the archive when you receive a new message.',
          toggle: true,
          icon: <bi.BiArchive />,
        },
      ],
    },
    {
      section: 'Notification',
      child: [
        {
          target: 'ringtone',
          title: 'Ringtone',
          desc: null,
          toggle: true,
          icon: <bi.BiBell />,
        },
      ],
    },
    {
      section: 'Help',
      child: [
        {
          target: 'feedback',
          title: 'Feedback',
          desc: null,
          toggle: false,
          icon: <bi.BiMailSend />,
        },
        {
          target: 'term',
          title: 'Term & privacy police',
          desc: null,
          toggle: false,
          icon: <bi.BiCheckShield />,
        },
        {
          target: 'license',
          title: 'License',
          desc: null,
          toggle: false,
          icon: <bi.BiCopyright />,
        },
      ],
    },
  ];

  const handleGetSetting = async () => {
    try {
      const { data } = await axios.get('/settings');

      document.body.classList[data.payload.dark ? 'add' : 'remove']('dark');
      setSetting(data.payload);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    handleGetSetting();
  }, []);

  return (
    <div
      className={`
        ${modal.setting ? 'delay-75' : '-translate-x-full'}
        transition duration-200 absolute w-full h-full z-10 grid grid-rows-[auto_1fr] overflow-hidden
        bg-white dark:bg-spill-900 dark:text-white/90
      `}
    >
      {/* header */}
      <div className="p-4 flex gap-8 items-center">
        <button
          type="button"
          onClick={() => {
            dispatch(setModal({ target: 'setting' }));
          }}
        >
          <bi.BiArrowBack className="text-2xl" />
        </button>
        <h1 className="text-2xl font-bold">Setting</h1>
      </div>
      <div className="grid gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
        {
          setting && structure.map((struct) => (
            <div key={struct.section} className="grid">
              <h1 className="font-bold ml-4">{struct.section}</h1>
              {
                struct.child.map((child) => (
                  <div key={child.target} aria-hidden className="p-4 grid grid-cols-[auto_1fr_auto] items-start gap-8 cursor-default border-0 border-b border-solid border-spill-200 dark:border-spill-800 hover:bg-spill-100/60 dark:hover:bg-spill-800/60">
                    <i>{child.icon}</i>
                    <span>
                      <p>{child.title}</p>
                      { child.desc && <p className="mt-1 text-sm opacity-60">{child.desc}</p> }
                    </span>
                    {
                      child.toggle && (
                        <button
                          type="button"
                          className={`
                            ${setting[child.target] ? 'bg-sky-200 dark:bg-sky-400' : 'bg-spill-200 dark:bg-spill-700'}
                            flex relative p-1 w-10 rounded-full
                          `}
                          onClick={async () => {
                            await axios.put('/settings', {
                              [child.target]: !setting[child.target],
                            });

                            handleGetSetting();
                          }}
                        >
                          <span
                            className={`
                              ${setting[child.target] ? 'bg-sky-600 dark:bg-sky-900 translate-x-4' : 'bg-spill-600 dark:bg-spill-300'}
                              transition block w-4 h-4 rounded-full
                            `}
                          >
                          </span>
                        </button>
                      )
                    }
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Setting;
