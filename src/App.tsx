import React from 'react';
import './App.css';

import { cut } from 'jieba-wasm';

type TextData = {
  title: string;
  totalCharacters: number;
  totalWords: number;
  uniqueCharacters: number;
  uniqueWords: number;
};

function App() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [data, setData] = React.useState<Array<TextData>>([]);

  function addTextData(title: string, text: string) {
    const regexp = /[\p{sc=Han}]/gu; // match only hanzi (technically unified han)
    const filteredChars = text.match(regexp) ?? [];

    // HMM disabled to match CTA stats, seems to result in more word combos
    const totalWords = cut(text, false);
    const filteredWords = totalWords
      .filter((word) => {
        return word.match(regexp);
      })
      .sort();

    const uniqueChars = new Set(filteredChars);
    const uniqueWords = new Set(filteredWords);

    const newData: TextData = {
      title,
      totalCharacters: filteredChars.length,
      totalWords: filteredWords.length,
      uniqueCharacters: uniqueChars.size,
      uniqueWords: uniqueWords.size,
    };

    setData([...data, newData]);
  }

  async function handleFileUpload(e: React.FormEvent) {
    e.preventDefault();
    const files: FileList | null | undefined = fileInputRef?.current?.files;

    const file = files?.item(0);
    console.log(file?.name);

    const text = await file?.text();

    if (!file?.name || !text) {
      throw Error('failed to read file: ' + file);
    }

    addTextData(file.name, text);
  }

  return (
    <>
      <h1>Chinese Text Compare</h1>
      <form onSubmit={handleFileUpload}>
        <input
          ref={fileInputRef}
          type="file"
          id="fileUpload"
          accept="text/plain"
          required></input>
        <pre id="parsed-content">{data.map((obj) => JSON.stringify(obj)).join('\n')}</pre>
        <button type="submit">Upload Text</button>
      </form>
    </>
  );
}

export default App;
