import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA service worker for offline functionality
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline fallback silent catch
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
