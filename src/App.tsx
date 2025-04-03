import React from 'react'
import './App.css'

import init, { cut } from 'jieba-wasm';

await init();

console.log(cut("中华人民共和国武汉市长江大桥", true));
// [ '中华人民共和国', '武汉市', '长江大桥' ]

function App() {

  return (
    <>
      <h1>Chinese Text Compare</h1>
      <input type='file' id='fileUpload'></input>
      <div>
        <button>
          Upload Text
        </button>
      </div>
    </>
  )
}

export default App;