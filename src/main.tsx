import { StrictMode } from 'react';
import init, { cut } from 'jieba-wasm';
import { createRoot } from 'react-dom/client';

import './reset.css';
import './index.css';
import App from './App.tsx';

// Jieba initialization
// TODO: move to context provider if necessary
await init();
console.log(cut('中华人民共和国武汉市长江大桥', true));
// [ '中华人民共和国', '武汉市', '长江大桥' ]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
