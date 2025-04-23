import { StrictMode } from 'react';
import init from 'jieba-wasm';
import { createRoot } from 'react-dom/client';

import './reset.css';
import App from './App.tsx';

// Jieba initialization
// TODO: move to context provider if necessary
await init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
