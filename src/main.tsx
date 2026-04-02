import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
<<<<<<< HEAD
import { AppDataProvider } from './state/AppDataContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppDataProvider>
=======

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
>>>>>>> main
  </React.StrictMode>
);
