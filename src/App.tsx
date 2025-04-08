import React from 'react';
import './App.css';

import { cut } from 'jieba-wasm';

type TextMetadata = {
  title: string;
  totalCharacters: number;
  totalWords: number;
  uniqueCharacters: number;
  uniqueWords: number;
};

const MetadataDisplayHeaders: { [K in keyof Required<TextMetadata>]: string } = {
  title: 'Title',
  totalCharacters: 'Total Characters',
  totalWords: 'Total Words',
  uniqueCharacters: 'Unique Characters',
  uniqueWords: 'Unique Words',
};

const VisibleHeaders: Array<keyof TextMetadata> = [
  'title',
  'totalCharacters',
  'totalWords',
  'uniqueCharacters',
  'uniqueWords',
];

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

    const uniqueChars = new Set(filteredChars);
    const uniqueWords = new Set(filteredWords);

    const newData: TextMetadata = {
      title,
      totalCharacters: filteredChars.length,
      totalWords: filteredWords.length,
      uniqueCharacters: uniqueChars.size,
      uniqueWords: uniqueWords.size,
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
      <table>
        <caption>Chinese Text Metadata</caption>
        <thead>
          <tr>
            {VisibleHeaders.map((val) => {
              return (
                <th scope="col" key={val}>
                  {MetadataDisplayHeaders[val]}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            return (
              <tr key={item.title}>
                {VisibleHeaders.map((key) => {
                  return <td key={key}>{item[key]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default App;
