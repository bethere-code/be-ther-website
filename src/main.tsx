import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// No StrictMode: it double-invokes effects in dev and fires every admin GET twice.
createRoot(document.getElementById('root')!).render(<App />);
