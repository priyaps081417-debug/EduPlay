import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('EDUPLAY ServiceWorker registered: ', registration.scope);
      })
      .catch((error) => {
        console.log('EDUPLAY ServiceWorker registration failed: ', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);

