import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  //Aquí estás cargando TailwindCSS
import './i18n';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
