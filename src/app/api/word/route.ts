import { NextResponse } from 'next/server';

interface DictionaryResponse {
  word: string;
  phonetic?: string;
  meanings: Array<{
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
    synonyms?: string[];
    antonyms?: string[];
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
  sinonimos: string[];
  antonimos: string[];
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
      'serendipity',    // en lugar de 'luck'
      'ephemeral',      // en lugar de 'temporary'
      'mellifluous',    // en lugar de 'sweet'
      'ethereal',       // en lugar de 'light'
      'luminous',       // en lugar de 'bright'
      'enigmatic',      // en lugar de 'mysterious'
      'resilient',      // en lugar de 'strong'
      'ineffable',      // en lugar de 'amazing'
      'sublime',        // en lugar de 'beautiful'
      'pristine',       // en lugar de 'clean'
      'eloquent',       // en lugar de 'clear'
      'euphoric',       // en lugar de 'happy'
      'tenacious',      // en lugar de 'determined'
      'serene',         // en lugar de 'calm'
      'sagacious',      // en lugar de 'wise'
      'benevolent',     // en lugar de 'kind'
      'resplendent',    // en lugar de 'bright'
      'melancholy',     // en lugar de 'sad'
      'ubiquitous',     // en lugar de 'everywhere'
      'quintessential', // en lugar de 'perfect'
      'ethereal',       // en lugar de 'light'
      'ephemeral',      // en lugar de 'brief'
      'ineffable',      // en lugar de 'indescribable'
      'surreptitious'   // en lugar de 'secret'
    ];

    // Mejorar el cálculo del día
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    console.log('Fecha actual:', dateString);

    // Usar la fecha completa para el índice
    const dateNumber = parseInt(dateString.replace(/-/g, ''));
    const wordIndex = dateNumber % commonWords.length;
    console.log('Índice de palabra seleccionada:', wordIndex);
    
    const word = commonWords[wordIndex];
    console.log('Palabra seleccionada:', word);

    const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const [dictData]: DictionaryResponse[] = await dictResponse.json();

    // Obtener sinónimos y antónimos únicos
    const sinonimos = Array.from(new Set([
      ...(dictData.meanings[0].synonyms || []),
      ...(dictData.meanings[0].definitions[0].synonyms || [])
    ])).slice(0, 3); // Limitamos a 3 sinónimos

    const antonimos = Array.from(new Set([
      ...(dictData.meanings[0].antonyms || []),
      ...(dictData.meanings[0].definitions[0].antonyms || [])
    ])).slice(0, 3); // Limitamos a 3 antónimos

    // Traducir todo en paralelo
    const [traduccion, significado, ejemplo, sinonimsTraducidos, antonimsTraducidos] = await Promise.all([
      translateText(word),
      translateText(dictData.meanings[0].definitions[0].definition),
      dictData.meanings[0].definitions[0].example 
        ? translateText(dictData.meanings[0].definitions[0].example)
        : Promise.resolve("No hay ejemplo disponible"),
      Promise.all(sinonimos.map(s => translateText(s))),
      Promise.all(antonimos.map(a => translateText(a)))
    ]);

    return {
      word,
      date: new Date().toISOString().split('T')[0],
      traduccion,
      significado,
      ejemplo,
      pronunciacion: dictData.phonetic || dictData.phonetics?.[0]?.text || "",
      sinonimos: sinonimos.map((s, i) => `${s} (${sinonimsTraducidos[i]})`),
      antonimos: antonimos.map((a, i) => `${a} (${antonimsTraducidos[i]})`)
    };
  } catch (error) {
    console.error('Error getting word:', error);
    return {
      word: "hello",
      date: new Date().toISOString().split('T')[0],
      traduccion: "hola",
      significado: "Un saludo común",
      ejemplo: "¡Hola, ¿cómo estás?",
      pronunciacion: "/həˈləʊ/",
      sinonimos: ["hi (hola)", "greetings (saludos)"],
      antonimos: ["goodbye (adiós)", "farewell (despedida)"]
    };
  }
}

export const revalidate = 86400; // 24 hours

export async function GET() {
  try {
    const wordData = await getNewWord();
    
    return NextResponse.json(
      {
        id: Date.now(),
        espanol: wordData.traduccion,
        ingles: wordData.word,
        significado: wordData.significado,
        ejemplo: wordData.ejemplo,
        pronunciacion: wordData.pronunciacion,
        sinonimos: wordData.sinonimos,
        antonimos: wordData.antonimos
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache'
        }
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      id: Date.now(),
      espanol: "hola",
      ingles: "hello",
      significado: "Un saludo común",
      ejemplo: "¡Hola, ¿cómo estás?",
      pronunciacion: "/həˈləʊ/",
      sinonimos: ["hi (hola)", "greetings (saludos)"],
      antonimos: ["goodbye (adiós)", "farewell (despedida)"]
    });
  }
} 