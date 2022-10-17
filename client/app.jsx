import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import * as page from './pages';

function App() {
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8080/api';
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<page.auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
