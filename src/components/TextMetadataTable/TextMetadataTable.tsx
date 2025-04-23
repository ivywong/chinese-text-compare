import React from 'react';
import './style.css';

export type TextMetadata = {
  title: string;
  totalCharacters: number;
  totalWords: number;
  uniqueCharacters: number;
  uniqueCharsOnce: number;
  uniqueCharsOncePct: number;
  uniqueWords: number;
  uniqueWordsOnce: number;
  uniqueWordsOncePct: number;
};

const MetadataDisplayHeaders: { [K in keyof Required<TextMetadata>]: string } = {
  title: 'Title',
  totalCharacters: 'Total Characters',
  totalWords: 'Total Words',
  uniqueCharacters: 'Unique Characters',
  uniqueWords: 'Unique Words',
  uniqueCharsOnce: 'Unique Characters (Used Once)',
  uniqueCharsOncePct: 'Unique Characters (Used Once %)',
  uniqueWordsOnce: 'Unique Words (Used Once)',
  uniqueWordsOncePct: 'Unique Words (Used Once %)',
};

const VisibleHeaders: Array<keyof TextMetadata> = [
  'title',
  'totalCharacters',
  'totalWords',
  'uniqueCharacters',
  'uniqueCharsOnce',
  'uniqueCharsOncePct',
  'uniqueWords',
  'uniqueWordsOnce',
  'uniqueWordsOncePct',
];

const sampleData: Array<TextMetadata> = [
  {
    title: 'Test 1',
    totalCharacters: 1000,
    totalWords: 400,
    uniqueCharacters: 400,
    uniqueWords: 200,
    uniqueCharsOnce: 10,
    uniqueWordsOnce: 100,
    uniqueCharsOncePct: 0,
    uniqueWordsOncePct: 0,
  },
  {
    title: 'Test 2',
    totalCharacters: 1000000,
    totalWords: 5000,
    uniqueCharacters: 500,
    uniqueWords: 134,
    uniqueCharsOnce: 300,
    uniqueWordsOnce: 12,
    uniqueCharsOncePct: 0,
    uniqueWordsOncePct: 0,
  },
  {
    title: 'Test 3',
    totalCharacters: 12399,
    totalWords: 123,
    uniqueCharacters: 324,
    uniqueWords: 1243,
    uniqueCharsOnce: 134,
    uniqueWordsOnce: 133,
    uniqueCharsOncePct: 0,
    uniqueWordsOncePct: 0,
  },
];

function TextMetadataTable({ data }: { data: Array<TextMetadata> }) {
  const displayData = [...sampleData, ...data]; // TODO: remove sampleData after debugging

  return (
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
        {displayData.map((item) => {
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
  );
}

export default TextMetadataTable;
