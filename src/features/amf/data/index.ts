import { Question, Theme } from "../types";
import { theme01 } from "./themes/t01";
import { theme02 } from "./themes/t02";
import { theme03 } from "./themes/t03";
import { theme04 } from "./themes/t04";
import { theme05 } from "./themes/t05";
import { theme06 } from "./themes/t06";
import { theme07 } from "./themes/t07";
import { theme08 } from "./themes/t08";
import { theme09 } from "./themes/t09";
import { theme10 } from "./themes/t10";
import { theme11 } from "./themes/t11";
import { theme12 } from "./themes/t12";

export const THEMES: Theme[] = [
  theme01, theme02, theme03, theme04, theme05, theme06,
  theme07, theme08, theme09, theme10, theme11, theme12,
];

export const ALL_QUESTIONS: Question[] = THEMES.flatMap((t) => t.questions);

export const QUESTIONS_BY_ID: Record<string, Question> = Object.fromEntries(
  ALL_QUESTIONS.map((q) => [q.id, q]),
);

export const getTheme = (id?: string) => THEMES.find((t) => t.id === id);

export const TOTAL_SECTIONS = THEMES.reduce((n, t) => n + t.sections.length, 0);

export const sectionKey = (themeId: string, sectionId: string) => `${themeId}:${sectionId}`;

/** Format de l'examen certifié AMF (format en vigueur). */
export const EXAM_FORMAT = {
  questions: 120,
  categoryA: 33,
  categoryC: 87,
  durationMinutes: 120,
  passRate: 0.8,
};

export interface ExamMode {
  id: "complet" | "rapide";
  label: string;
  description: string;
  countA: number;
  countC: number;
  durationMinutes: number;
}

export const EXAM_MODES: ExamMode[] = [
  {
    id: "complet",
    label: "Examen blanc complet",
    description: "Conditions réelles : 120 questions (33 A + 87 C) en 2 heures.",
    countA: 33,
    countC: 87,
    durationMinutes: 120,
  },
  {
    id: "rapide",
    label: "Examen blanc express",
    description: "Format réduit : 40 questions (11 A + 29 C) en 40 minutes.",
    countA: 11,
    countC: 29,
    durationMinutes: 40,
  },
];
