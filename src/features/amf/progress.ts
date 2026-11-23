import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ALL_QUESTIONS, THEMES, sectionKey } from "./data";
import { Question } from "./types";

export interface QuestionStat {
  seen: number;
  correct: number;
  lastCorrect: boolean;
  lastSeen: string;
}

export interface QuizResult {
  id: string;
  date: string;
  scope: string; // themeId | "aleatoire" | "erreurs"
  score: number;
  total: number;
}

export interface ExamResult {
  id: string;
  date: string;
  mode: string;
  scoreA: number;
  totalA: number;
  scoreC: number;
  totalC: number;
  passed: boolean;
  durationSeconds: number;
}

export interface AmfProgress {
  readSections: string[];
  questionStats: Record<string, QuestionStat>;
  quizHistory: QuizResult[];
  examHistory: ExamResult[];
}

const EMPTY: AmfProgress = { readSections: [], questionStats: {}, quizHistory: [], examHistory: [] };
const EVENT = "amf-progress-updated";

const storageKey = (userId?: string) => `amf-academy-progress:${userId ?? "anonymous"}`;

function load(key: string): AmfProgress {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

function save(key: string, value: AmfProgress) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage indisponible : la progression reste en mémoire */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** Une question est « maîtrisée » si la dernière réponse est juste. */
export const isMastered = (s?: QuestionStat) => !!s && s.lastCorrect;

export function useAmfProgress() {
  const { user } = useAuth();
  const key = storageKey(user?.id);
  const [progress, setProgress] = useState<AmfProgress>(() => load(key));

  useEffect(() => {
    setProgress(load(key));
    const onUpdate = (e: Event) => {
      if ((e as CustomEvent).detail === key) setProgress(load(key));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setProgress(load(key));
    };
    window.addEventListener(EVENT, onUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  const update = useCallback(
    (fn: (p: AmfProgress) => AmfProgress) => {
      const next = fn(load(key));
      save(key, next);
      setProgress(next);
    },
    [key],
  );

  const toggleSection = useCallback(
    (themeId: string, sectionId: string, read?: boolean) =>
      update((p) => {
        const k = sectionKey(themeId, sectionId);
        const has = p.readSections.includes(k);
        const shouldRead = read ?? !has;
        if (shouldRead === has) return p;
        return {
          ...p,
          readSections: shouldRead ? [...p.readSections, k] : p.readSections.filter((s) => s !== k),
        };
      }),
    [update],
  );

  const recordAnswers = useCallback(
    (answers: { questionId: string; correct: boolean }[]) =>
      update((p) => {
        const stats = { ...p.questionStats };
        const now = new Date().toISOString();
        for (const a of answers) {
          const prev = stats[a.questionId] ?? { seen: 0, correct: 0, lastCorrect: false, lastSeen: now };
          stats[a.questionId] = {
            seen: prev.seen + 1,
            correct: prev.correct + (a.correct ? 1 : 0),
            lastCorrect: a.correct,
            lastSeen: now,
          };
        }
        return { ...p, questionStats: stats };
      }),
    [update],
  );

  const recordQuiz = useCallback(
    (r: Omit<QuizResult, "id" | "date">) =>
      update((p) => ({
        ...p,
        quizHistory: [{ ...r, id: uid(), date: new Date().toISOString() }, ...p.quizHistory].slice(0, 100),
      })),
    [update],
  );

  const recordExam = useCallback(
    (r: Omit<ExamResult, "id" | "date">) =>
      update((p) => ({
        ...p,
        examHistory: [{ ...r, id: uid(), date: new Date().toISOString() }, ...p.examHistory].slice(0, 50),
      })),
    [update],
  );

  const reset = useCallback(() => update(() => EMPTY), [update]);

  const stats = useMemo(() => {
    const perTheme = THEMES.map((t) => {
      const read = t.sections.filter((s) => progress.readSections.includes(sectionKey(t.id, s.id))).length;
      const mastered = t.questions.filter((q) => isMastered(progress.questionStats[q.id])).length;
      const seen = t.questions.filter((q) => progress.questionStats[q.id]).length;
      return {
        themeId: t.id,
        read,
        totalSections: t.sections.length,
        mastered,
        seen,
        totalQuestions: t.questions.length,
        coursePct: Math.round((read / t.sections.length) * 100),
        masteryPct: Math.round((mastered / t.questions.length) * 100),
      };
    });
    const totalSections = perTheme.reduce((n, t) => n + t.totalSections, 0);
    const totalRead = perTheme.reduce((n, t) => n + t.read, 0);
    const totalMastered = perTheme.reduce((n, t) => n + t.mastered, 0);
    const mistakes = ALL_QUESTIONS.filter((q) => {
      const s = progress.questionStats[q.id];
      return s && !s.lastCorrect;
    });
    return {
      perTheme,
      coursePct: Math.round((totalRead / totalSections) * 100),
      masteryPct: Math.round((totalMastered / ALL_QUESTIONS.length) * 100),
      totalMastered,
      mistakes,
    };
  }, [progress]);

  return { progress, stats, toggleSection, recordAnswers, recordQuiz, recordExam, reset };
}

/* ---------- Tirage des questions ---------- */

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Question dont l'ordre des propositions a été mélangé. */
export interface PreparedQuestion extends Question {
  /** Ordre d'affichage : indices dans `options` */
  order: number[];
}

export const prepare = (q: Question): PreparedQuestion => ({
  ...q,
  order: shuffle(q.options.map((_, i) => i)),
});

/**
 * Tire `count` questions en répartissant équitablement entre les thèmes
 * (tirage en tourniquet), pour refléter la couverture du programme.
 */
export function drawBalanced(pool: Question[], count: number): Question[] {
  const byTheme = new Map<string, Question[]>();
  for (const q of shuffle(pool)) {
    if (!byTheme.has(q.themeId)) byTheme.set(q.themeId, []);
    byTheme.get(q.themeId)!.push(q);
  }
  const buckets = shuffle([...byTheme.values()]);
  const out: Question[] = [];
  while (out.length < count && buckets.some((b) => b.length)) {
    for (const b of buckets) {
      if (out.length >= count) break;
      const q = b.pop();
      if (q) out.push(q);
    }
  }
  return out;
}

export function buildExam(countA: number, countC: number): PreparedQuestion[] {
  const a = drawBalanced(ALL_QUESTIONS.filter((q) => q.category === "A"), countA);
  const c = drawBalanced(ALL_QUESTIONS.filter((q) => q.category === "C"), countC);
  return shuffle([...a, ...c]).map(prepare);
}
