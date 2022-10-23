import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import { setSubModal } from '../../../../redux/features/submodal';

function NewContact() {
  const dispatch = useDispatch();
  const submodal = useSelector((state) => state.submodal);

  const [respond, setRespond] = useState({ success: true, message: null });
  const [form, setForm] = useState({ username: '', fullname: '' });

  const handleChange = async (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post('/contacts', form);

      // reset form state
      setForm({ username: '', fullname: '' });
      setRespond({ success: true, message: data.message });

      setTimeout(() => {
        dispatch(setSubModal({
          target: 'newcontact',
        }));
      }, 1000);
    }
    catch (error0) {
      setRespond({
        success: false,
        message: error0.response.data.message,
      });
    }
  };

  return (
    <div
      className={`
        ${submodal.newcontact ? 'z-10' : '-z-50 opacity-0 delay-300'}
        absolute w-full h-full flex justify-center items-center
        bg-spill-600/20 dark:bg-black/40 dark:text-white/90
      `}
    >
      <span
        className="absolute w-full h-full -z-10"
        aria-hidden
        onClick={() => {
          dispatch(setSubModal({ target: 'newcontact' }));
          // reset state
          setRespond((prev) => ({ ...prev, message: null }));
          setForm({ username: '', fullname: '' });
        }}
      >
      </span>
      <div className={`${!submodal.newcontact && 'scale-0'} transition m-8 p-4 w-full rounded-md bg-white dark:bg-spill-800`}>
        {/* header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">New Contact</h1>
          {
            // respond
            respond.message && (
              <span className="mt-1 flex gap-2">
                {
                  respond.success
                    ? <bi.BiCheck className="text-xl text-emerald-600" />
                    : <bi.BiX className="text-xl text-red-600" />
                }
                <p className="text-sm">{respond.message}</p>
              </span>
            )
          }
        </div>
        {/* content */}
        <div>
          <form method="post" onSubmit={handleSubmit} className="grid">
            <div className="flex gap-4 items-center">
              <img
                src="assets/images/default-avatar.png"
                alt="assets/images/default-avatar.png"
                className="w-20 h-20 rounded-full"
              />
              <span className="w-full grid gap-2">
                {
                  [
                    { target: 'username', required: true, ph: 'Username' },
                    { target: 'fullname', required: false, ph: 'Contact name (optional)' },
                  ].map((elem) => (
                    <input
                      type="text"
                      key={elem.target}
                      name={elem.target}
                      id={elem.target}
                      placeholder={elem.ph}
                      minLength={3}
                      className="peer w-full pb-2 border-0 border-b border-solid border-spill-200 focus:border-spill-400 dark:border-spill-700 dark:focus:border-spill-600"
                      onChange={handleChange}
                      value={form[elem.target]}
                      required={elem.required}
                    />
                  ))
                }
              </span>
            </div>
            <span className="flex gap-2 mt-6 justify-end">
              <button
                type="button"
                className="py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-spill-700"
                onClick={() => {
                  dispatch(setSubModal({ target: 'signout' }));
                  // reset state
                  setRespond((prev) => ({ ...prev, message: null }));
                  setForm({ username: '', fullname: '' });
                }}
              >
                <p>Cancel</p>
              </button>
              <button
                type="submit"
                className="py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700"
              >
                <p className="font-bold text-white/90">Done</p>
              </button>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewContact;
