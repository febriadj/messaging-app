import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './style.css';
import * as page from './pages';
import { setMaster } from './redux/features/user';
import socket from './helpers/socket';

function App() {
  const dispatch = useDispatch();
  const { master } = useSelector((state) => state.user);

  // get access token from localStorage
  const token = localStorage.getItem('token');

  const handleGetMaster = async (signal) => {
    try {
      if (token) {
        // set default authorization
        axios.defaults.headers.Authorization = `Bearer ${token}`;

        const { data } = await axios.get('/users', { signal });
        // set master
        dispatch(setMaster(data.payload));
        socket.emit('user/signin', { userId: data.payload._id });
      }
    }
    catch (error0) {
      console.error(error0.response.data.message);
    }
  };

  useEffect(() => {
    const abortCtrl = new AbortController();
    // set default base url
    axios.defaults.baseURL = 'http://localhost:8080/api';
    handleGetMaster(abortCtrl.signal);

    return () => {
      abortCtrl.abort();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {
          master
            ? <Route exact path="*" element={master.verified ? <page.chat /> : <page.verify />} />
            : <Route exact path="*" element={<page.auth />} />
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
