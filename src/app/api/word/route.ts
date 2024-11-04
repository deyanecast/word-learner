import { NextResponse } from 'next/server';

interface DictionaryResponse {
  word: string;
  phonetic?: string;
  meanings: Array<{
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
  phonetics?: Array<{
    text?: string;
  }>;
}

interface UsedWord {
  word: string;
  date: string;
  traduccion: string;
  significado: string;
  ejemplo: string;
  pronunciacion: string;
}

async function translateText(text: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

async function getNewWord(): Promise<UsedWord> {
  try {
    const commonWords = [
      'hello', 'world', 'love', 'happy', 'friend', 'learn',
      'smile', 'hope', 'dream', 'peace', 'joy', 'kind',
      'brave', 'light', 'heart', 'mind', 'soul', 'life',
      'time', 'good', 'wise', 'free', 'true', 'calm'
    ];

    // Usar la fecha para seleccionar la palabra
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const wordIndex = dayOfYear % commonWords.length;
    const word = commonWords[wordIndex];

    const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const [dictData]: DictionaryResponse[] = await dictResponse.json();

    const [traduccion, significado, ejemplo] = await Promise.all([
      translateText(word),
      translateText(dictData.meanings[0].definitions[0].definition),
      dictData.meanings[0].definitions[0].example 
        ? translateText(dictData.meanings[0].definitions[0].example)
        : Promise.resolve("No hay ejemplo disponible")
    ]);

    return {
      word,
      date: new Date().toISOString().split('T')[0],
      traduccion,
      significado,
      ejemplo,
      pronunciacion: dictData.phonetic || dictData.phonetics?.[0]?.text || ""
    };
  } catch (error) {
    console.error('Error getting word:', error);
    return {
      word: "hello",
      date: new Date().toISOString().split('T')[0],
      traduccion: "hola",
      significado: "Un saludo común",
      ejemplo: "¡Hola, ¿cómo estás?",
      pronunciacion: "/həˈləʊ/"
    };
  }
}

export const revalidate = 86400; // 24 hours

export async function GET() {
  try {
    const wordData = await getNewWord();
    
    return NextResponse.json({
      id: Date.now(),
      espanol: wordData.traduccion,
      ingles: wordData.word,
      significado: wordData.significado,
      ejemplo: wordData.ejemplo,
      pronunciacion: wordData.pronunciacion
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      id: Date.now(),
      espanol: "hola",
      ingles: "hello",
      significado: "Un saludo común",
      ejemplo: "¡Hola, ¿cómo estás?",
      pronunciacion: "/həˈləʊ/"
    });
  }
} 