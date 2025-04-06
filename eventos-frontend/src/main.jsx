import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  //Aquí estás cargando TailwindCSS
import './i18n';
import Router from './router';  //Tu archivo de rutas principal

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
