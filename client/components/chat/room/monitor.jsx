import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as ri from 'react-icons/ri';
import * as bi from 'react-icons/bi';
import Linkify from 'linkify-react';
import socket from '../../../helpers/socket';
import { setSelectedChats } from '../../../redux/features/chore';
import { setPage } from '../../../redux/features/page';

function Monitor({ loaded, chats, setChats }) {
  const dispatch = useDispatch();
  const {
    chore: { selectedChats },
    room: { chat: chatRoom },
    user: { master },
    page,
  } = useSelector((state) => state);

  const isGroup = chatRoom.data.roomType === 'group';
  const longclickval = useRef(0);

  const handleLongClickMove = () => clearInterval(longclickval.current);
  const handleLongClickEnd = () => clearInterval(longclickval.current);
  const handleLongClickStart = (chatId) => {
    let i = 1;

    longclickval.current = setInterval(() => {
      if (i >= 3) {
        clearInterval(longclickval.current);
        dispatch(setSelectedChats(chatId));

        return;
      }

      i += 1;
    }, 200);
  };

  useEffect(() => {
    if (chats) {
      if (master._id !== chats[chats.length - 1]?.userId) {
        const { roomId, ownersId } = chatRoom.data;
        socket.emit('chat/read', { roomId, ownersId });
      }
    }
  }, [chats ? chats.length : !!chats]);

  useEffect(() => {
    socket.on('chat/read', (payload) => setChats(payload));

    return () => {
      socket.off('chat/read');
    };
  }, []);

  return (
    <div
      id="monitor"
      aria-hidden
      className={`
        ${loaded ? 'scrollbar-thin' : 'scrollbar-none'} scrollbar-thumb-spill-300 hover:scrollbar-thumb-spill-400 dark:scrollbar-thumb-spill-800 dark:hover:scrollbar-thumb-spill-700
        select-text relative overflow-y-auto bg-spill-100 dark:bg-spill-950
      `}
      onClick={() => {
        dispatch(setSelectedChats([]));
      }}
    >
      { !loaded && (
        <div className="absolute w-full h-full z-10 flex justify-center items-center bg-spill-100 dark:bg-spill-950">
          <span className="flex gap-2 items-center">
            <i className="animate-spin"><bi.BiLoaderAlt size={18} /></i>
            <p>Loading...</p>
          </span>
        </div>
      ) }
      <div className="relative py-4 flex flex-col">
        {
          chats && chats
            .filter((elem) => !elem.deletedBy.includes(master._id))
            .map((elem, i, arr) => (
              <React.Fragment key={elem._id}>
                {
                  // chat header: show datetime every new days
                  moment(elem.createdAt).date() !== (i > 0 && moment(arr[i - 1].createdAt).date())
                    && (
                      <div className="my-2 flex justify-center">
                        <span className="block py-0.5 px-2 rounded-full bg-white dark:bg-spill-800">
                          <p className="text-sm">{moment(elem.createdAt).format('LL')}</p>
                        </span>
                      </div>
                    )
                }
                <div
                  className={`
                    ${elem.userId !== arr[i + 1]?.userId && 'mb-2'}
                    ${selectedChats.includes(elem._id) && 'bg-spill-200 dark:bg-black/20'}
                    w-full py-0.5 px-4 flex gap-4 justify-center items-center
                  `}
                >
                  { selectedChats.includes(elem._id) && (
                    <span className="p-0.5 rounded-full bg-sky-200 dark:bg-sky-600">
                      <bi.BiCheck size={18} />
                    </span>
                  ) }
                  <div className={`${elem.userId === master._id && 'justify-end'} w-[560px] flex`}>
                    {/* chat card */}
                    <div
                      className={`
                        ${elem.userId === master._id ? ' ml-12 rounded-l-xl bg-sky-200 dark:bg-sky-600/40' : 'mr-12 rounded-r-xl bg-white dark:bg-spill-800'}
                        ${elem.userId === arr[i - 1]?.userId && moment(elem.createdAt).date() === moment(arr[i - 1]?.createdAt).date() && 'rounded-xl'}
                        group relative p-2 rounded-b-xl overflow-hidden
                      `}
                      aria-hidden
                      onTouchStart={() => handleLongClickStart(elem._id)}
                      onTouchEnd={() => handleLongClickEnd()}
                      onTouchMove={() => handleLongClickMove()}
                      onClick={(e) => {
                        e.stopPropagation();

                        if (e.ctrlKey) {
                          dispatch(setSelectedChats(elem._id));
                        }
                      }}
                    >
                      {
                        elem.replyTo && (
                          <div className="relative mb-2 rounded-xl grid grid-cols-[auto_1fr] overflow-hidden bg-black/5 dark:bg-black/20">
                            <span className="block w-1 h-full bg-sky-600 dark:bg-sky-200"></span>
                            <span className="py-2 px-3">
                              <span className="text-sm">{elem.reply.fullname}</span>
                              <p className="text-sm opacity-60">{elem.reply.text}</p>
                            </span>
                          </div>
                        )
                      }
                      {
                        elem.file && (
                          <div className="mb-2">
                            { elem.file.type === 'image' && <img src={elem.file.url} alt="" className="w-full rounded-lg" /> }
                            { elem.file.type !== 'image' && (
                              <span
                                className={`
                                  ${elem.userId === master._id ? 'bg-sky-100' : 'bg-spill-100'}
                                  p-2 grid grid-cols-[auto_1fr_auto] gap-2 rounded-lg dark:bg-black/20
                                `}
                              >
                                <i className="translate-y-0.5"><ri.RiFileTextFill size={20} /></i>
                                <p className="break-all">{elem.file.originalname}</p>
                                <a
                                  href={elem.file.url}
                                  download={elem.file.originalname}
                                  className="block ml-2 translate-y-0.5"
                                >
                                  <i className="text-black dark:text-white hover:text-sky-600 dark:hover:text-sky-400">
                                    <bi.BiDownload size={20} />
                                  </i>
                                </a>
                              </span>
                            ) }
                          </div>
                        )
                      }
                      {/* chat body message */}
                      <div className="px-1">
                        {/* profile avatar in group chat */}
                        { isGroup && (
                          <span
                            className="truncate grid grid-cols-[auto_1fr] gap-2 items-start cursor-pointer"
                            aria-hidden
                            onClick={() => {
                              if (
                                master._id !== elem.userId
                                && page.friendProfile !== elem.userId
                              ) {
                                dispatch(setPage({
                                  target: 'friendProfile',
                                  data: elem.userId,
                                }));
                              }
                            }}
                          >
                            <img src={elem.profile.avatar} alt="" className="w-5 h-5 rounded-full" />
                            <p className="font-bold truncate text-sky-800 dark:text-sky-200">{elem.profile.fullname}</p>
                          </span>
                        ) }
                        <p
                          className="break-all"
                          aria-hidden
                          onClick={(e) => {
                            if (e.ctrlKey) e.preventDefault();
                          }}
                        >
                          <Linkify as="span">{elem.text}</Linkify>
                          <span className={`${elem.userId === master._id && 'mr-5'} invisible text-xs ml-1`}>{moment(elem.createdAt).format('LT')}</span>
                        </p>
                        <span className="p-2 absolute bottom-0 right-0 flex gap-0.5 items-center">
                          <p className="text-xs opacity-80">{moment(elem.createdAt).format('LT')}</p>
                          {
                            elem.userId === master._id && (
                              <i>
                                {
                                  elem.readed
                                    ? <ri.RiCheckDoubleFill size={18} className="text-sky-600 dark:text-sky-400" />
                                    : <ri.RiCheckFill size={18} className="opacity-80" />
                                }
                              </i>
                            )
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))
        }
        {
          (chats && !isGroup) && !chatRoom.data.profile.active && (
            <div className="py-2 px-6 flex justify-center border-0 border-y border-solid border-rose-400 dark:border-rose-200/60 bg-rose-400/10 dark:bg-rose-200/20">
              <div className="w-[560px]">
                <p className="text-rose-900 dark:text-rose-100">This account has been deleted by the owner, you no longer have access to send messages to this account.</p>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Monitor;
