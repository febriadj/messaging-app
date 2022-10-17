import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import * as fc from 'react-icons/fc';

function Login({ setLogin }) {
  const sign = JSON.parse(localStorage.getItem('sign'));

  // respond API request
  const [respond, setRespond] = useState({ success: true, message: null });
  const [form, setForm] = useState({
    pin: sign?.remember ? sign.remember : '',
    password: '',
    remember: false,
  });

  const handleChange = (e) => {
    // if it's a checkbox, get target.checked
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

    // close respond modal if opened
    if (respond.message) {
      setRespond((prev) => ({
        ...prev,
        message: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios({
        method: 'POST',
        url: '/users/login',
        data: form,
      });

      // revert form state
      setForm((prev) => ({ ...prev, pin: '', password: '' }));

      // store jwt token on localStorage
      localStorage.setItem('sign', JSON.stringify({
        token: data.payload,
        remember: form.remember ? form.pin : null,
      }));

      setRespond((prev) => ({
        ...prev,
        success: true,
        message: data.message,
      }));

      // reload this page after 1s
      setTimeout(() => window.location.reload(), 1000);
    }
    catch (error0) {
      setRespond((prev) => ({
        ...prev,
        success: false,
        message: error0.response.data.message,
      }));
    }
  };

  return (
    <div className="absolute w-full h-full bg-white">
      <Helmet>
        <title>Sign in - Spill</title>
      </Helmet>
      {
        respond.message && (
          <div className="absolute w-full flex justify-center">
            <span className={`${respond.success ? 'bg-emerald-50' : 'bg-red-50'} mt-2 mx-10 py-1 px-3 shadow-lg flex justify-between items-center gap-3`}>
              <p>{respond.message}</p>
              {
                respond.success
                  ? <bi.BiCheck className="text-xl text-emerald-600" />
                  : <bi.BiX className="text-xl text-red-600" />
              }
            </span>
          </div>
        )
      }
      <div className="py-5 px-10">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <div className="grid gap-2 mt-5">
          <button type="button" className="relative py-2 flex justify-center items-center rounded-md border border-solid border-gray-300 hover:bg-gray-50">
            <fc.FcGoogle className="text-xl absolute left-0 translate-x-3" />
            <p className="text-center">Continue with Google</p>
          </button>
        </div>
        <div className="mt-3 mb-5 grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
          <span className="block w-full h-[1px] bg-gray-300"></span>
          <p>or</p>
          <span className="block w-full h-[1px] bg-gray-300"></span>
        </div>
        <form method="post" className="grid gap-2" onSubmit={handleSubmit}>
          <label htmlFor="pin" className="relative flex items-center">
            <bi.BiEnvelope className="absolute text-xl translate-x-3" />
            <input
              type="text"
              name="pin"
              id="pin"
              placeholder="Pin or email address"
              minLength={8}
              className={`${form.pin.length > 0 ? 'peer valid:bg-gray-50' : ''} w-full py-3 pl-12 pr-3 border border-solid border-gray-300 rounded-md focus:border-gray-900`}
              value={form.pin}
              onChange={handleChange}
              required
            />
            <bi.BiCheck className="absolute right-0 text-xl text-emerald-600 hidden peer-valid:block -translate-x-3" />
            <bi.BiX className="absolute right-0 text-xl text-red-600 hidden peer-invalid:block -translate-x-3" />
          </label>
          <label htmlFor="password" className="relative flex items-center">
            <bi.BiLockOpenAlt className="absolute text-xl translate-x-3" />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              minLength={6}
              className={`${form.password.length > 0 ? 'peer valid:bg-gray-50' : ''} w-full py-3 pl-12 pr-3 border border-solid border-gray-300 rounded-md focus:border-gray-900`}
              value={form.password}
              onChange={handleChange}
              required
            />
            <bi.BiCheck className="absolute right-0 text-xl text-emerald-600 hidden peer-valid:block -translate-x-3" />
            <bi.BiX className="absolute right-0 text-xl text-red-600 hidden peer-invalid:block -translate-x-3" />
          </label>
          <span className="flex">
            <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                onChange={handleChange}
              />
              <p>remember me</p>
            </label>
          </span>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 mt-5 py-3 rounded-md">
            <p className="font-bold text-white">Sign in</p>
          </button>
        </form>
        <div className="absolute bottom-0 py-5">
          <span className="flex items-center gap-2">
            <p>Don&#39;t have an account?</p>
            <button
              type="button"
              className="font-bold hover:underline"
              onClick={() => {
                setLogin(false);
              }}
            >
              Sign up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
