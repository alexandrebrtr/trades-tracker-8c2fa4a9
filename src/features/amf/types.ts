export type QuestionCategory = "A" | "C";

export interface Question {
  id: string;
  themeId: string;
  /** A = connaissances essentielles, C = culture financière générale */
  category: QuestionCategory;
  question: string;
  options: string[];
  /** Index de la bonne réponse dans `options` */
  answer: number;
  explanation: string;
}

export interface CourseSection {
  id: string;
  title: string;
  /** Contenu en Markdown (GFM : tableaux, listes, gras…) */
  content: string;
  /** Points clés à retenir, affichés en fin de section */
  keyPoints?: string[];
}

export interface Theme {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  /** Durée de lecture estimée en minutes */
  duration: number;
  sections: CourseSection[];
  questions: Question[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  themeId?: string;
}

type RawQuestion = [QuestionCategory, string, string[], number, string];

/** Petit utilitaire pour écrire les questions de façon compacte. */
export function buildQuestions(themeId: string, raw: RawQuestion[]): Question[] {
  return raw.map(([category, question, options, answer, explanation], i) => ({
    id: `${themeId}-q${String(i + 1).padStart(2, "0")}`,
    themeId,
    category,
    question,
    options,
    answer,
    explanation,
  }));
}
