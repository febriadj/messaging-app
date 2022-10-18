import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import * as bi from 'react-icons/bi';
import * as fc from 'react-icons/fc';

function Register({ setLogin }) {
  const dataStep2 = localStorage.getItem('registerStep2');

  const [step2, setStep2] = useState(dataStep2 ? JSON.parse(dataStep2) : null);
  // respond API request
  const [respond, setRespond] = useState({ success: true, message: null });
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    otp: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

      if (step2 && form.otp !== String(step2.otp)) {
        const errData = {
          message: 'Invalid OTP code',
        };
        throw errData;
      }

      const { data } = await axios({
        method: 'POST',
        url: !step2 ? '/users/register' : '/users/register/confirm',
        data: !step2 ? form : step2,
      });

      setRespond({ success: true, message: data.message });
      // revert form state
      setForm({
        fullname: '',
        email: '',
        password: '',
        otp: '',
      });

      setTimeout(() => {
        if (!step2) {
          // store register data on localStorage after 1s
          localStorage.setItem('registerStep2', JSON.stringify(data.payload));
          setStep2(data.payload);
        } else {
          localStorage.removeItem('registerStep2');
          // set email cache
          localStorage.setItem('cache', JSON.stringify({ remember: step2.email }));

          setLogin(true);
        }
      }, 1000);
    }
    catch (error0) {
      const { message = null } = error0;

      setRespond(() => ({
        success: false,
        message: message || error0.response.data.message,
      }));
    }
  };

  return (
    <div className="absolute w-full h-full bg-white">
      <Helmet>
        <title>Sign up - Spill</title>
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
        <div className="mb-5">
          <h1 className="text-2xl font-bold">Sign up</h1>
          {
            step2 && (
              <p className="mt-2">
                <span>Your 4-digit OTP code has been sent to your email </span>
                <b>{step2.email}</b>
              </p>
            )
          }
        </div>
        {
          !step2 && (
            <>
              <div className="grid gap-2">
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
                <label htmlFor="fullname" className="relative flex items-center">
                  <bi.BiUser className="absolute text-xl translate-x-3" />
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    placeholder="Full name"
                    minLength={6}
                    className={`${form.fullname.length > 0 ? 'peer valid:bg-gray-50' : ''} w-full py-3 pl-12 pr-3 border border-solid border-gray-300 rounded-md focus:border-gray-900`}
                    value={form.fullname}
                    onChange={handleChange}
                    required
                  />
                  <bi.BiCheck className="absolute right-0 text-xl text-emerald-600 hidden peer-valid:block -translate-x-3" />
                  <bi.BiX className="absolute right-0 text-xl text-red-600 hidden peer-invalid:block -translate-x-3" />
                </label>
                <label htmlFor="email" className="relative flex items-center">
                  <bi.BiEnvelope className="absolute text-xl translate-x-3" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email address"
                    minLength={8}
                    className={`${form.email.length > 0 ? 'peer valid:bg-gray-50' : ''} w-full py-3 pl-12 pr-3 border border-solid border-gray-300 rounded-md focus:border-gray-900`}
                    value={form.email}
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
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 mt-5 py-3 rounded-md">
                  <p className="font-bold text-white">Sign up</p>
                </button>
              </form>
            </>
          )
        }
        {
          step2 && (
            <form method="post" className="grid gap-2" onSubmit={handleSubmit}>
              <label htmlFor="otp" className="relative flex items-center">
                <bi.BiLockOpenAlt className="absolute text-xl translate-x-3" />
                <input
                  type="number"
                  name="otp"
                  id="otp"
                  placeholder="One-time password"
                  className="w-full py-3 pl-12 pr-3 border border-solid border-gray-300 rounded-md focus:border-gray-900"
                  value={form.otp}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 mt-5 py-3 rounded-md">
                <p className="font-bold text-white">Sign up</p>
              </button>
            </form>
          )
        }
        <div className="absolute bottom-0 py-5">
          <span className="flex items-center gap-2">
            <p>Already have an account?</p>
            <button
              type="button"
              className="font-bold hover:underline"
              onClick={() => {
                setLogin(true);
              }}
            >
              Sign in
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
