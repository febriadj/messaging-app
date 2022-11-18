import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import * as md from 'react-icons/md';
import { setAvatar } from '../../../redux/features/user';
import { setPage } from '../../../redux/features/page';
import { setModal } from '../../../redux/features/modal';

function Profile() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.page);
  const avatar = useSelector((state) => state.user.avatar);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullname: '',
    username: '',
    bio: '',
    phone: '',
    email: '',
  });

  const handleGetProfile = async (signal) => {
    try {
      // get profile if profile page is opened
      if (page.profile) {
        const { data } = await axios.get('/profiles', {
          params: { userId: page.profile },
          signal,
        });

        setProfile(data.payload);
        dispatch(setAvatar(data.payload.avatar));
      } else {
        // destroy when profile page is closed after 150ms
        setTimeout(() => setProfile(null), 150);
      }
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  const handleEditBtn = async (e, elem) => {
    const parent = e.target.parentElement;
    const ctrl = parent.querySelector('#profile-edit-control');
    const editable = ctrl.hasAttribute('contentEditable');

    if (editable) {
      // remove contentEditable attr
      ctrl.removeAttribute('contentEditable');

      if (form[elem.label] !== profile[elem.label]) {
        try {
          await axios.put('/profiles', { [elem.label]: form[elem.label] });
        }
        catch (error0) {
          const errRespond = parent.querySelector('#error-respond');
          errRespond.classList.remove('hidden');
          errRespond.innerHTML = error0.response.data.message;

          return;
        }
      }
    } else {
      // set contentEditable attr
      ctrl.setAttribute('contentEditable', 'true');
      ctrl.focus();
      ctrl.selectionStart = ctrl.innerText.length;

      setForm((prev) => ({
        ...prev,
        [elem.label]: elem.data,
      }));
    }

    // change border color
    parent.classList[!editable ? 'add' : 'remove']('border-sky-600', 'dark:border-sky-400');
    // edit-btn icon
    [...e.target.children].forEach((c) => {
      c.classList.toggle('hidden');
    });
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    handleGetProfile(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, [page.profile]);

  return (
    <div
      className={`
        ${page.profile ? 'delay-75' : '-translate-x-full'}
        transition duration-200 absolute w-full h-full z-10 grid grid-rows-[auto_1fr] overflow-hidden
        bg-white dark:bg-spill-900 dark:text-white/90
      `}
    >
      {/* header */}
      <div className="h-16 px-2 flex gap-6 justify-between items-center">
        <div className="flex gap-4 items-center">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
            onClick={() => {
              dispatch(setPage({ target: 'profile' }));
            }}
          >
            <bi.BiArrowBack />
          </button>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
        <button
          type="button"
          className="p-2 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setModal({
              target: 'qr',
              data: profile,
            }));
          }}
        >
          <bi.BiQr />
        </button>
      </div>
      {
        profile && (
          <div className="select-text overflow-y-auto scrollbar-thin scrollbar-thumb-spill-200 hover:scrollbar-thumb-spill-300 dark:scrollbar-thumb-spill-700 dark:hover:scrollbar-thumb-spill-600">
            <div className="p-4 flex flex-col items-center">
              <button
                type="button"
                className="group relative w-28 h-28 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setModal({ target: 'avatarUpload' }));
                }}
              >
                <span className="group-hover:opacity-100 bg-black/40 absolute w-full h-full z-10 opacity-0 flex justify-center items-center">
                  <i className="text-white"><md.MdPhotoCamera size={40} /></i>
                </span>
                <img
                  src={avatar}
                  alt=""
                  className="w-full h-full"
                />
              </button>
              <label htmlFor="profile-edit-control" className="relative flex items-start mt-4 px-10 cursor-text">
                <h1
                  id="profile-edit-control"
                  suppressContentEditableWarning
                  className="break-all text-2xl font-bold text-center"
                  onInput={(e) => setForm((prev) => ({
                    ...prev,
                    fullname: e.target.innerText,
                  }))}
                >
                  {profile.fullname}
                </h1>
                <button
                  type="button"
                  className="absolute right-0 p-1 rounded-full cursor-pointer hover:bg-spill-100 dark:hover:bg-spill-800"
                  onClick={(e) => handleEditBtn(e, {
                    label: 'fullname',
                    data: profile.fullname,
                  })}
                >
                  <bi.BiPencil size={20} className="pointer-events-none" />
                  <bi.BiCheck size={20} className="hidden pointer-events-none text-sky-600 dark:text-sky-400" />
                </button>
              </label>
            </div>
            <div className="grid">
              {
                [
                  {
                    label: 'username',
                    data: profile.username,
                    desc: 'People will be able to find you by this username and contact you.',
                    icon: <bi.BiAt />,
                  },
                  { label: 'bio', data: profile.bio, icon: <bi.BiInfoCircle /> },
                  { label: 'phone', data: profile.phone, icon: <bi.BiPhone /> },
                  { label: 'email', data: profile.email, icon: <bi.BiEnvelope /> },
                ]
                  .map((elem) => (
                    <div key={elem.label} className="py-2 px-4 break-all grid grid-cols-[auto_1fr_auto] gap-4 items-start border-0 border-b border-solid border-spill-100 dark:border-spill-800">
                      <i>{elem.icon}</i>
                      <span>
                        <p className="text-sm opacity-60 capitalize">{elem.label}</p>
                        <p
                          id="profile-edit-control"
                          className="mt-1 w-full"
                          suppressContentEditableWarning
                          aria-hidden
                          onKeyPress={(e) => {
                            if (elem.label === 'phone') {
                              if (!'0123456789'.includes(e.key)) {
                                e.preventDefault();
                              }
                            }
                          }}
                          onInput={(e) => {
                            setForm((prev) => ({
                              ...prev,
                              [elem.label]: e.target.innerText,
                            }));
                          }}
                        >
                          {elem.data}
                        </p>
                        { elem.desc && <p className="mt-2 text-sm opacity-60">{elem.desc}</p> }
                        <p id="error-respond" className="hidden mt-2 text-sm text-rose-600 dark:text-rose-400"></p>
                      </span>
                      { elem.label !== 'email' && (
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-spill-100 dark:hover:bg-spill-800"
                          onClick={(e) => handleEditBtn(e, elem)}
                        >
                          <bi.BiPencil size={20} className="pointer-events-none" />
                          <bi.BiCheck size={20} className="hidden pointer-events-none text-sky-600 dark:text-sky-400" />
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
