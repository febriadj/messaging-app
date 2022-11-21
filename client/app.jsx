import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './style.css';
import * as route from './routes';
import { setMaster } from './redux/features/user';
import socket from './helpers/socket';

function App() {
  const dispatch = useDispatch();
  const { master } = useSelector((state) => state.user);

  const [inactive, setInactive] = useState(false);

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
        socket.emit('user/connect', data.payload._id);
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

    socket.on('user/inactivate', () => {
      setInactive(true);
      dispatch(setMaster(null));
    });

    return () => {
      abortCtrl.abort();
      socket.off('user/inactivate');
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {
          inactive && <Route exact path="*" element={<route.inactive />} />
        }
        {
          !inactive && master
            ? <Route exact path="*" element={master.verified ? <route.chat /> : <route.verify />} />
            : <Route exact path="*" element={<route.auth />} />
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
