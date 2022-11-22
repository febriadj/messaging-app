import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as ri from 'react-icons/ri';
import * as bi from 'react-icons/bi';
import Linkify from 'linkify-react';
import socket from '../../../../helpers/socket';

function Monitor({ loaded, chats, setChats }) {
  const { user: { master }, room: { chat: chatRoom } } = useSelector((state) => state);

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
      className={`
        ${loaded ? 'scrollbar-thin' : 'scrollbar-none'} scrollbar-thumb-spill-300 hover:scrollbar-thumb-spill-400 dark:scrollbar-thumb-spill-800 dark:hover:scrollbar-thumb-spill-700
        select-text relative overflow-y-auto bg-spill-100 dark:bg-spill-950
      `}
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
          chats && chats.map((elem, i, arr) => (
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
              <div className={`${elem.userId !== arr[i + 1]?.userId && 'mb-2'} w-full py-0.5 px-4 flex justify-center`}>
                <div className={`${elem.userId === master._id && 'justify-end'} w-[560px] flex`}>
                  {/* chat card */}
                  <div
                    className={`
                      ${elem.userId === master._id ? ' ml-12 rounded-l-xl bg-sky-200 dark:bg-sky-600/40' : 'mr-12 rounded-r-xl bg-white dark:bg-spill-800'}
                      ${elem.userId === arr[i - 1]?.userId && moment(elem.createdAt).date() === moment(arr[i - 1]?.createdAt).date() && 'rounded-xl'}
                      relative p-2 rounded-b-xl overflow-hidden
                    `}
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
                    {/* chat body message */}
                    <div className="px-1">
                      <p className="break-all">
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
          chats && !chatRoom.data.profile.active && (
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
