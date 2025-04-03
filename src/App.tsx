import React from 'react';
import './App.css';

import { cut } from 'jieba-wasm';

function App() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const parsedOutputRef = React.useRef<HTMLPreElement>(null);

  async function handleFileUpload(e: React.FormEvent) {
    e.preventDefault();
    const files: FileList | null | undefined = fileInputRef?.current?.files;

    const file = files?.item(0);
    console.log(file?.name);

    const text = await file?.text();

    if (!text) {
      throw Error('failed to read file: ' + file);
    }

    console.log(text);
    console.log(cut(text));
  }

  return (
    <>
      <h1>Chinese Text Compare</h1>
      <form onSubmit={handleFileUpload}>
        <input ref={fileInputRef} type="file" id="fileUpload"></input>
        <pre ref={parsedOutputRef} id="parsed-content"></pre>
        <button type="submit">Upload Text</button>
      </form>
    </>
  );
}

export default App;
