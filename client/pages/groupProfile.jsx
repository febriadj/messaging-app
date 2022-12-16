import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import * as ri from 'react-icons/ri';
import * as md from 'react-icons/md';

import { setChatRoom } from '../redux/features/room';
import { setPage } from '../redux/features/page';
import { setModal } from '../redux/features/modal';

import socket from '../helpers/socket';

function GroupProfile() {
  const dispatch = useDispatch();
  const {
    chore: { refreshGroupAvatar },
    room: { chat: chatRoom },
    page: { groupProfile, addParticipant },
    user: { master },
  } = useSelector((state) => state);

  const [participants, setParticipants] = useState(null);
  const [group, setGroup] = useState(null);

  const handleGetGroup = (signal) => {
    if (groupProfile && !addParticipant) {
      axios.all([
        axios.get(`/groups/${groupProfile}`, { signal }),
        axios.get(`/groups/${groupProfile}/participants`, { params: { skip: 0, limit: 10 }, signal }),
      ])
        .then(axios.spread(({ data: data1 }, { data: data2 }) => {
          setGroup(data1.payload);
          setParticipants(data2.payload);
        }))
        .catch((error0) => console.error(error0.message));
    } else {
      setTimeout(() => {
        setParticipants(null);
        setGroup(null);
      }, 150);
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    handleGetGroup(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [groupProfile, addParticipant]);

  useEffect(() => {
    socket.on('group/edit', (payload) => {
      setGroup((prev) => ({ ...prev, ...payload }));

      dispatch(setChatRoom({
        ...chatRoom,
        data: {
          ...chatRoom.data,
          group: {
            ...chatRoom.data.group,
            ...payload,
          },
        },
      }));
    });

    return () => {
      socket.off('group/edit');
    };
  }, []);

  return (
    <div
      className={`
        ${!groupProfile && 'translate-x-full'}
        transition absolute w-full sm:w-[380px] h-full right-0 z-0 grid grid-rows-[auto_1fr] overflow-hidden
        bg-white dark:bg-spill-900
      `}
    >
      {
        // loading animation
        !group && (
          <div className="absolute w-full h-full flex justify-center items-center bg-white dark:bg-spill-900">
            <span className="flex gap-2 items-center">
              <i className="animate-spin"><bi.BiLoaderAlt size={18} /></i>
              <p>Loading</p>
            </span>
          </div>
        )
      }
      {/* header */}
      <div className="h-16 px-2 z-10 flex gap-6 justify-between items-center">
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
        { group && group.adminId === master._id && (
          <button
            type="button"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
            onClick={(e) => {
              e.stopPropagation();
              // data: _id, name, and desc
              dispatch(setModal({
                target: 'editGroup',
                data: group,
              }));
            }}
          >
            <i><bi.BiPencil /></i>
          </button>
        ) }
      </div>
      {
        group && (
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
            <div className="p-4 flex flex-col items-center">
              <button
                type="button"
                className="group relative w-28 h-28 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();

                  if (group.adminId !== master._id) {
                    dispatch(setModal({ target: 'photoFull', data: group.avatar }));
                  } else {
                    dispatch(setModal({
                      target: 'avatarUpload',
                      data: {
                        targetId: group._id,
                        isGroup: true,
                      },
                    }));
                  }
                }}
              >
                <span className="group-hover:opacity-100 bg-black/40 absolute w-full h-full z-10 opacity-0 flex justify-center items-center">
                  { group.adminId === master._id && <i className="text-white"><md.MdPhotoCamera size={40} /></i> }
                </span>
                <img src={refreshGroupAvatar || group.avatar} alt="" className="w-full h-full" />
              </button>
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
                <p className="opacity-60">{`${group.participantsId.length} participants`}</p>
              </div>
              <div className="grid">
                {
                  participants && participants.map((elem) => (
                    <div
                      key={elem._id}
                      className={`
                        p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center cursor-pointer
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
                      {/* admin tag */}
                      { elem.userId === group.adminId && (
                        <span className="h-full">
                          <p className="font-bold text-xs py-0.5 px-2 rounded-full text-white bg-sky-600">Admin</p>
                        </span>
                      ) }
                    </div>
                  ))
                }
                {
                  group.participantsId.length > participants.length && (
                    <button
                      type="button"
                      className="mb-6 py-2 px-4 flex gap-4 hover:bg-spill-800"
                      onClick={() => {
                        dispatch(setPage({
                          target: 'groupParticipant',
                          data: {
                            totalParticipants: group.participantsId.length,
                            groupId: group._id,
                            adminId: group.adminId,
                          },
                        }));
                      }}
                    >
                      <i><bi.BiChevronDown /></i>
                      <p>{`View all (${group.participantsId.length - participants.length} more)`}</p>
                    </button>
                  )
                }
              </div>
            </div>
          </div>
        )
      }
      {
        group && (
          <button
            type="button"
            className={`
              ${addParticipant && 'scale-0 opacity-0'}
              transition absolute z-10 bottom-0 right-0 -translate-x-6 -translate-y-6
              w-16 h-16 rounded-full flex justify-center items-center shadow-xl text-white bg-sky-600
              hover:brightness-110
            `}
            onClick={() => {
              dispatch(setPage({
                target: 'addParticipant',
                data: {
                  participantsId: group.participantsId,
                  groupId: group._id,
                  roomId: group.roomId,
                },
              }));
            }}
          >
            <i><ri.RiUserAddFill size={28} /></i>
          </button>
        )
      }
    </div>
  );
}

export default GroupProfile;
