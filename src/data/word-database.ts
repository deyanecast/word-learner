export interface Word {
  id: number;
  espanol: string;
  ingles: string;
  significado: string;
  ejemplo: string;
  pronunciacion: string;
  fecha?: string; // Para registrar cuándo se mostró la palabra
}

export const wordDatabase: Word[] = [
  {
    id: 1,
    espanol: "Serendipia",
    ingles: "Serendipity",
    significado: "The occurrence and development of events by chance in a happy or beneficial way",
    ejemplo: "The discovery of penicillin was a serendipity",
    pronunciacion: "/ˌserənˈdɪpɪti/"
  },
  // Aquí iremos agregando más palabras...
]; 