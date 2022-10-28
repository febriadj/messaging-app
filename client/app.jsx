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

  // get & parse cache from localStorage
  const cache = JSON.parse(localStorage.getItem('cache'));

  const handleGetMaster = async () => {
    try {
      // set default authorization
      axios.defaults.headers.Authorization = `Bearer ${cache.token}`;

      const { data } = await axios.get('/users');
      socket.emit('user/signin', { userId: data.payload._id });
      // set master
      dispatch(setMaster(data.payload));
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  useEffect(() => {
    // set default base url
    axios.defaults.baseURL = 'http://localhost:8080/api';

    if (cache?.token) handleGetMaster();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="*" element={master ? <page.chat /> : <page.auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
