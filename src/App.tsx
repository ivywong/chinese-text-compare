import React from 'react';
import './index.css';
import TextMetadataTable, {
  TextMetadata,
} from './components/TextMetadataTable/TextMetadataTable';

import { cut } from 'jieba-wasm';

function App() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [data, setData] = React.useState<Array<TextMetadata>>([]);

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

    const charsCount = new Map();
    const wordsCount = new Map();

    for (const c of filteredChars) {
      if (charsCount.has(c)) {
        charsCount.set(c, charsCount.get(c) + 1);
      } else {
        charsCount.set(c, 1);
      }
    }

    for (const w of filteredWords) {
      if (wordsCount.has(w)) {
        wordsCount.set(w, wordsCount.get(w) + 1);
      } else {
        wordsCount.set(w, 1);
      }
    }

    const uniqueWordsOnce = [...wordsCount].filter(([, v]) => v === 1);
    const uniqueCharsOnce = [...charsCount].filter(([, v]) => v === 1);

    const newData: TextMetadata = {
      title,
      totalCharacters: filteredChars.length,
      totalWords: filteredWords.length,
      uniqueCharacters: charsCount.size,
      uniqueCharsOnce: uniqueCharsOnce.length,
      uniqueCharsOncePct: Math.floor((uniqueCharsOnce.length / charsCount.size) * 100),
      uniqueWords: wordsCount.size,
      uniqueWordsOnce: uniqueWordsOnce.length,
      uniqueWordsOncePct: Math.floor((uniqueWordsOnce.length / wordsCount.size) * 100),
    };

    console.debug({ data, newData });
    setData([...data, newData]);
  }

  async function handleFileUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!fileInputRef.current) {
      return;
    }

    const files: FileList | null | undefined = fileInputRef.current.files;
    // TODO: consider allowing multiple file selections
    const file = files?.item(0);
    console.log(`Uploaded '${file?.name}'`);

    const text = await file?.text();

    // TODO: surface user-facing error messages
    if (!file?.name || !text) {
      throw Error(`failed to read file: ${file}`);
    }

    if (data.map((item) => item.title).includes(file.name)) {
      throw Error(`file already analyzed: ${file.name}`);
    }

    addTextData(file.name, text);
    fileInputRef.current.files = new DataTransfer().files;
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
        <button type="submit">Upload Text</button>
      </form>
      <TextMetadataTable data={data}></TextMetadataTable>
    </>
  );
}

export default App;
