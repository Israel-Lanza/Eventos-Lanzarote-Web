// src/App.jsx
import React, { useEffect } from 'react';
import i18n from './i18n';
import Router from './router';
import { Toaster } from 'react-hot-toast';

const App = () => {
  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router />
    </>
  );
};

export default App;
