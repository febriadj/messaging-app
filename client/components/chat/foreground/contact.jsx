import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import { setModal } from '../../../redux/features/modal';

function Contact() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);

  const [contacts, setContacts] = useState([]);

  const handleGetContacts = async (signal) => {
    try {
      // get contacts if contact modal is opened
      if (modal.contact) {
        const { data } = await axios.get('/contacts', { signal });
        setContacts(data.payload);
      } else {
        // revert when modal is closed
        setContacts([]);
      }
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    handleGetContacts(ctrl.signal);

    return () => {
      ctrl.abort();
    };
  }, [modal.contact]);

  return (
    <div
      className={`
        ${modal.contact ? 'delay-75' : '-translate-x-full'}
        transition duration-200 absolute w-full h-full z-10 grid grid-rows-[auto_1fr] overflow-hidden
        bg-white dark:bg-spill-900 dark:text-white/90
      `}
    >
      {/* header */}
      <div className="p-4 grid gap-4">
        <div className="flex gap-6 items-center">
          <button
            type="button"
            onClick={() => {
              dispatch(setModal({ target: 'contact' }));
            }}
          >
            <bi.BiArrowBack className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold">Contact</h1>
        </div>
      </div>
      {/* content */}
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
        <div
          className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center cursor-default border-0 border-b border-solid border-spill-200 dark:border-spill-800 hover:bg-spill-100/60 dark:hover:bg-spill-800/60"
          aria-hidden
        >
          <span className="w-14 h-14 bg-sky-400 text-black rounded-full flex justify-center items-center">
            <i><bi.BiUserPlus /></i>
          </span>
          <h1 className="text-lg font-bold">New Contact</h1>
        </div>
        {
          contacts.length > 0 && contacts.map((elem) => (
            <div key={elem._id} className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 items-center cursor-default border-0 border-b border-solid border-spill-200 dark:border-spill-800 hover:bg-spill-100/60 dark:hover:bg-spill-800/60">
              <img
                src={`assets/images/avatar/${elem.avatar}`}
                alt=""
                className="w-14 h-14 rounded-full"
              />
              <span className="overflow-hidden">
                <h1 className="text-lg font-bold">{elem.fullname}</h1>
                { elem.bio.length > 0 && (
                  <p className="truncate opacity-60 mt-0.5">{elem.bio}</p>
                ) }
              </span>
              <bi.BiDotsVerticalRounded />
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Contact;
