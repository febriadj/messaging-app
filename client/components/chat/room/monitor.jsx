import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as ri from 'react-icons/ri';
import Linkify from 'linkify-react';
import socket from '../../../helpers/socket';

function Monitor({ chats, setChats }) {
  const { user: { master }, chat: { room } } = useSelector((state) => state);

  useEffect(() => {
    if (chats) {
      if (master._id !== chats[chats.length - 1].userId) {
        const { roomId, ownersId } = room;
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
    <div id="monitor" className="flex justify-center overflow-y-auto bg-spill-100 dark:bg-spill-950 scrollbar-thin scrollbar-thumb-spill-300 hover:scrollbar-thumb-spill-400 dark:scrollbar-thumb-spill-800 dark:hover:scrollbar-thumb-spill-700">
      <div className="relative w-full max-w-[560px] py-2 px-6 flex flex-col gap-1">
        {
          // chats
          chats && chats.map((elem, i, arr) => (
            <div key={elem._id}>
              {
                 moment(elem.createdAt).date()
                 !== (i > 0 && moment(arr[i - 1].createdAt).date())
                  && (
                    <div className="my-4 flex justify-center">
                      <span className="block py-0.5 px-2 rounded-full bg-white dark:bg-spill-800">
                        <p className="text-sm">{moment(elem.createdAt).format('LL')}</p>
                      </span>
                    </div>
                  )
              }
              <div
                className={`
                  ${i < arr.length - 1 && (elem.userId !== arr[i + 1].userId) && 'mb-4'}
                  ${i === arr.length - 1 && 'mb-6'}
                  ${elem.userId === master._id ? 'justify-end' : 'justify-start'}
                  flex
                `}
              >
                <div
                  className={`
                    ${elem.userId === master._id ? 'ml-12 rounded-l-xl bg-sky-200 dark:bg-sky-400/40' : 'mr-12 rounded-r-xl bg-white dark:bg-spill-800'}
                    ${i > 0 && (elem.userId === arr[i - 1].userId) && 'rounded-xl'}
                    relative p-2 rounded-b-xl grid gap-2
                  `}
                >
                  { elem.replyTo && (
                    <div className="rounded-md flex overflow-hidden dark:bg-spill-900/40">
                      <span className="block w-1 h-full bg-sky-200"></span>
                      <span className="p-2 text-sm">
                        <p className="font-bold">{elem.reply.username}</p>
                        <p className="opacity-60">{elem.reply.text}</p>
                      </span>
                    </div>
                  ) }
                  <div className="px-2">
                    <p className="[&>a]:text-sky-200 break-all">
                      <Linkify as="span">{elem.text}</Linkify>
                      <span className={`${elem.userId === master._id && 'mr-5'} inline-block invisible text-xs ml-0.5`}>
                        {moment(elem.createdAt).format('LT')}
                      </span>
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
          ))
        }
      </div>
    </div>
  );
}

export default Monitor;
