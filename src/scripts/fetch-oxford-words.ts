import { Word } from '../data/word-database';
import fs from 'fs';
import path from 'path';

const wordList = [
  "serendipity",
  "ephemeral",
  "mellifluous",
  // Agrega aquí las palabras que quieras buscar
];

async function fetchOxfordDefinition(word: string): Promise<Word | null> {
  const app_id = process.env.NEXT_PUBLIC_OXFORD_APP_ID;
  const app_key = process.env.NEXT_PUBLIC_OXFORD_APP_KEY;
  const language = "en-gb";

  try {
    const response = await fetch(
      `https://od-api.oxforddictionaries.com/api/v2/entries/${language}/${word}`,
      {
        headers: {
          'app_id': app_id!,
          'app_key': app_key!,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: Date.now(),
      espanol: word, // Aquí necesitarías agregar la traducción manualmente
      ingles: word,
      significado: data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0],
      ejemplo: data.results[0].lexicalEntries[0].entries[0].senses[0].examples?.[0]?.text || "No example available",
      pronunciacion: data.results[0].lexicalEntries[0].pronunciations?.[0]?.phoneticSpelling || ""
    };
  } catch (error) {
    console.error(`Error fetching definition for ${word}:`, error);
    return null;
  }
}

async function updateDatabase() {
  const dbPath = path.join(process.cwd(), 'src/data/word-database.ts');
  const words: Word[] = [];

  for (const word of wordList) {
    const definition = await fetchOxfordDefinition(word);
    if (definition) {
      words.push(definition);
      // Esperar un poco entre peticiones para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const dbContent = `
export interface Word {
  id: number;
  espanol: string;
  ingles: string;
  significado: string;
  ejemplo: string;
  pronunciacion: string;
  fecha?: string;
}

export const wordDatabase: Word[] = ${JSON.stringify(words, null, 2)};
`;

  fs.writeFileSync(dbPath, dbContent);
  console.log(`Base de datos actualizada con ${words.length} palabras`);
}

updateDatabase().catch(console.error); 