// src/App.jsx
import React, { useEffect } from 'react';
import i18n from './i18n';
import Router from './router';

const App = () => {
  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  return <Router />;
};

export default App;
