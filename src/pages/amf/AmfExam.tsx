import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AmfShell } from "@/features/amf/components/AmfShell";
import { QuestionView } from "@/features/amf/components/QuestionView";
import { buildExam, PreparedQuestion, useAmfProgress } from "@/features/amf/progress";
import { EXAM_FORMAT, EXAM_MODES, ExamMode, QUESTIONS_BY_ID, THEMES } from "@/features/amf/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock, Flag, GraduationCap, XCircle,
} from "lucide-react";

const STORAGE_KEY = "amf-academy-exam-in-progress";

interface ExamSession {
  modeId: ExamMode["id"];
  questions: { id: string; order: number[] }[];
  answers: Record<string, number>;
  flagged: string[];
  startedAt: number;
  deadline: number;
}

interface ExamOutcome {
  mode: ExamMode;
  questions: PreparedQuestion[];
  answers: Record<string, number>;
  flagged: string[];
  durationSeconds: number;
}

const loadSession = (): ExamSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ExamSession) : null;
  } catch {
    return null;
  }
};
const saveSession = (s: ExamSession | null) => {
  try {
    if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

const hydrate = (s: ExamSession): PreparedQuestion[] =>
  s.questions.filter((q) => QUESTIONS_BY_ID[q.id]).map((q) => ({ ...QUESTIONS_BY_ID[q.id], order: q.order }));

export default function AmfExam() {
  const [session, setSession] = useState<ExamSession | null>(() => loadSession());
  const [outcome, setOutcome] = useState<ExamOutcome | null>(null);

  const start = (mode: ExamMode) => {
    const qs = buildExam(mode.countA, mode.countC);
    const now = Date.now();
    const s: ExamSession = {
      modeId: mode.id,
      questions: qs.map((q) => ({ id: q.id, order: q.order })),
      answers: {},
      flagged: [],
      startedAt: now,
      deadline: now + mode.durationMinutes * 60_000,
    };
    saveSession(s);
    setOutcome(null);
    setSession(s);
    window.scrollTo({ top: 0 });
  };

  const finish = (s: ExamSession) => {
    const mode = EXAM_MODES.find((m) => m.id === s.modeId) ?? EXAM_MODES[0];
    saveSession(null);
    setSession(null);
    setOutcome({
      mode,
      questions: hydrate(s),
      answers: s.answers,
      flagged: s.flagged,
      durationSeconds: Math.round((Math.min(Date.now(), s.deadline) - s.startedAt) / 1000),
    });
    window.scrollTo({ top: 0 });
  };

  const abandon = () => {
    saveSession(null);
    setSession(null);
  };

  if (session) return <ExamRunner session={session} onChange={(s) => { saveSession(s); setSession(s); }} onFinish={finish} onAbandon={abandon} />;
  if (outcome) return <ExamResults outcome={outcome} onRetry={() => setOutcome(null)} />;
  return <ExamSetup onStart={start} />;
}

/* ---------------- Écran de lancement ---------------- */

function ExamSetup({ onStart }: { onStart: (m: ExamMode) => void }) {
  return (
    <AmfShell>
      <h1 className="text-2xl font-bold mb-1">Examen blanc</h1>
      <p className="text-muted-foreground mb-6 max-w-prose">
        Mettez-vous en conditions réelles : chronomètre, aucune correction avant la fin, et résultat calculé
        selon les règles de l'examen certifié (au moins {EXAM_FORMAT.passRate * 100} % dans chaque catégorie).
      </p>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {EXAM_MODES.map((m) => (
          <Card key={m.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> {m.label}
              </CardTitle>
              <CardDescription>{m.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-md bg-muted p-2">
                  <p className="text-lg font-semibold tabular-nums">{m.countA + m.countC}</p>
                  <p className="text-xs text-muted-foreground">questions</p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <p className="text-lg font-semibold tabular-nums">{m.durationMinutes}</p>
                  <p className="text-xs text-muted-foreground">minutes</p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <p className="text-lg font-semibold tabular-nums">
                    {Math.ceil(m.countA * EXAM_FORMAT.passRate)} / {Math.ceil(m.countC * EXAM_FORMAT.passRate)}
                  </p>
                  <p className="text-xs text-muted-foreground">minimum A / C</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => onStart(m)}>Commencer</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Conseils</p>
          <p>• Les questions de catégorie A portent sur les connaissances essentielles (réglementation, déontologie, LCB-FT…).</p>
          <p>• Marquez les questions douteuses pour y revenir avant de terminer.</p>
          <p>• Votre examen est sauvegardé automatiquement : vous pouvez recharger la page sans le perdre.</p>
        </CardContent>
      </Card>
    </AmfShell>
  );
}

/* ---------------- Déroulé de l'examen ---------------- */

function useCountdown(deadline: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return Math.max(0, Math.round((deadline - now) / 1000));
}

const fmt = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

function ExamRunner({
  session, onChange, onFinish, onAbandon,
}: {
  session: ExamSession;
  onChange: (s: ExamSession) => void;
  onFinish: (s: ExamSession) => void;
  onAbandon: () => void;
}) {
  const questions = useMemo(() => hydrate(session), [session.questions]); // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [abandonOpen, setAbandonOpen] = useState(false);
  const remaining = useCountdown(session.deadline);
  const mode = EXAM_MODES.find((m) => m.id === session.modeId) ?? EXAM_MODES[0];

  const finish = useCallback(() => onFinish(session), [onFinish, session]);
  useEffect(() => {
    if (remaining === 0) finish();
  }, [remaining, finish]);

  const q = questions[idx];
  const answeredCount = Object.keys(session.answers).length;
  const unanswered = questions.length - answeredCount;
  const flagged = session.flagged.includes(q.id);
  const lowTime = remaining < 5 * 60;

  const select = (opt: number) => onChange({ ...session, answers: { ...session.answers, [q.id]: opt } });
  const toggleFlag = () =>
    onChange({
      ...session,
      flagged: flagged ? session.flagged.filter((f) => f !== q.id) : [...session.flagged, q.id],
    });

  return (
    <AmfShell hideNav>
      <div className="sticky top-[var(--amf-sticky-top,3rem)] md:top-[var(--amf-sticky-top-md,0px)] z-20 -mx-3 md:-mx-0 mb-4 border-b bg-background/95 px-3 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{mode.label}</p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {answeredCount}/{questions.length} répondues · {session.flagged.length} marquée(s)
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-sm tabular-nums",
              lowTime ? "bg-red-500/15 text-red-600 dark:text-red-400" : "bg-muted",
            )}
            aria-live="polite"
            aria-label={`Temps restant ${fmt(remaining)}`}
          >
            <Clock className="h-4 w-4" /> {fmt(remaining)}
          </span>
          <Button size="sm" onClick={() => setConfirmOpen(true)}>Terminer</Button>
        </div>
        <Progress value={(answeredCount / questions.length) * 100} className="mt-2 h-1" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <QuestionView
              question={q}
              index={idx}
              total={questions.length}
              selected={session.answers[q.id]}
              onSelect={select}
              flagged={flagged}
              onToggleFlag={toggleFlag}
              showTheme={false}
            />
            <div className="mt-6 flex justify-between gap-2">
              <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Précédente
              </Button>
              {idx < questions.length - 1 ? (
                <Button onClick={() => setIdx(idx + 1)}>
                  Suivante <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={() => setConfirmOpen(true)}>Terminer l'examen</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="p-4">
              <p className="mb-3 text-sm font-medium">Navigation</p>
              <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-6 gap-1.5">
                {questions.map((x, i) => {
                  const answered = session.answers[x.id] !== undefined;
                  const isFlag = session.flagged.includes(x.id);
                  return (
                    <button
                      key={x.id}
                      type="button"
                      onClick={() => setIdx(i)}
                      aria-label={`Question ${i + 1}${answered ? ", répondue" : ""}${isFlag ? ", marquée" : ""}`}
                      className={cn(
                        "relative h-8 rounded text-xs tabular-nums transition-colors",
                        answered ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                        i === idx && "ring-2 ring-primary",
                      )}
                    >
                      {i + 1}
                      {isFlag && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-500" />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary/15" /> Répondue</p>
                <p className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-muted" /> Non répondue</p>
                <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Marquée</p>
              </div>
              <Button variant="ghost" size="sm" className="mt-4 w-full text-muted-foreground" onClick={() => setAbandonOpen(true)}>
                Abandonner l'examen
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminer l'examen ?</AlertDialogTitle>
            <AlertDialogDescription>
              {unanswered > 0
                ? `Il reste ${unanswered} question(s) sans réponse : elles seront comptées comme fausses.`
                : "Toutes les questions ont une réponse."}
              {session.flagged.length > 0 && ` ${session.flagged.length} question(s) sont marquées pour être revues.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer l'examen</AlertDialogCancel>
            <AlertDialogAction onClick={finish}>Voir mon résultat</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={abandonOpen} onOpenChange={setAbandonOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abandonner l'examen ?</AlertDialogTitle>
            <AlertDialogDescription>Vos réponses seront perdues et aucun résultat ne sera enregistré.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onAbandon} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Abandonner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AmfShell>
  );
}

/* ---------------- Résultats ---------------- */

type Filter = "erreurs" | "marquees" | "toutes";

function ExamResults({ outcome, onRetry }: { outcome: ExamOutcome; onRetry: () => void }) {
  const { recordAnswers, recordExam } = useAmfProgress();
  const [filter, setFilter] = useState<Filter>("erreurs");
  const { questions, answers, flagged, mode } = outcome;

  const res = useMemo(() => {
    const ok = (q: PreparedQuestion) => answers[q.id] === q.answer;
    const A = questions.filter((q) => q.category === "A");
    const C = questions.filter((q) => q.category === "C");
    const scoreA = A.filter(ok).length;
    const scoreC = C.filter(ok).length;
    const passA = scoreA / A.length >= EXAM_FORMAT.passRate;
    const passC = scoreC / C.length >= EXAM_FORMAT.passRate;
    const byTheme = THEMES.map((t) => {
      const qs = questions.filter((q) => q.themeId === t.id);
      return { theme: t, total: qs.length, score: qs.filter(ok).length };
    }).filter((x) => x.total > 0);
    return { scoreA, totalA: A.length, scoreC, totalC: C.length, passA, passC, passed: passA && passC, byTheme };
  }, [questions, answers]);

  // Enregistrement unique du résultat
  const saved = useRef(false);
  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    recordAnswers(questions.map((q) => ({ questionId: q.id, correct: answers[q.id] === q.answer })));
    recordExam({
      mode: mode.id,
      scoreA: res.scoreA,
      totalA: res.totalA,
      scoreC: res.scoreC,
      totalC: res.totalC,
      passed: res.passed,
      durationSeconds: outcome.durationSeconds,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const list = questions.filter((q) =>
    filter === "toutes" ? true : filter === "marquees" ? flagged.includes(q.id) : answers[q.id] !== q.answer,
  );

  return (
    <AmfShell>
      <Card className={cn("mb-6 border-2", res.passed ? "border-emerald-500/50" : "border-red-500/50")}>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            {res.passed ? (
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-2" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500 mb-2" />
            )}
            <p className="text-sm text-muted-foreground">{mode.label}</p>
            <h1 className="text-2xl sm:text-3xl font-bold">{res.passed ? "Examen réussi !" : "Examen non validé"}</h1>
            <p className="text-muted-foreground mt-1">
              {res.scoreA + res.scoreC}/{questions.length} bonnes réponses · durée {fmt(outcome.durationSeconds)}
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <CategoryScore label="Catégorie A" score={res.scoreA} total={res.totalA} pass={res.passA} />
            <CategoryScore label="Catégorie C" score={res.scoreC} total={res.totalC} pass={res.passC} />
          </div>
          {!res.passed && (
            <p className="mt-4 flex items-start gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
              Il faut au moins {EXAM_FORMAT.passRate * 100} % dans chacune des deux catégories : une bonne note dans
              l'une ne compense pas l'autre.
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button onClick={onRetry}>Nouvel examen blanc</Button>
            <Button asChild variant="outline">
              <Link to="/amf/quiz/erreurs">Réviser mes erreurs</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/amf">Tableau de bord</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Résultats par thème</CardTitle>
          <CardDescription>Repérez les thèmes à retravailler en priorité.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {res.byTheme
            .sort((a, b) => a.score / a.total - b.score / b.total)
            .map(({ theme, score, total }) => {
              const p = Math.round((score / total) * 100);
              return (
                <div key={theme.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-sm">
                  <Link to={`/amf/cours/${theme.id}`} className="truncate hover:text-primary">
                    {theme.number}. {theme.shortTitle}
                  </Link>
                  <span className={cn("tabular-nums", p < 80 && "text-red-600 dark:text-red-400")}>
                    {score}/{total} · {p} %
                  </span>
                  <Progress value={p} className="col-span-2 h-1.5" />
                </div>
              );
            })}
        </CardContent>
      </Card>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="mr-auto text-lg font-semibold">Correction détaillée</h2>
        {([
          ["erreurs", `Erreurs (${questions.filter((q) => answers[q.id] !== q.answer).length})`],
          ["marquees", `Marquées (${flagged.length})`],
          ["toutes", `Toutes (${questions.length})`],
        ] as [Filter, string][]).map(([f, label]) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f === "marquees" && <Flag className="h-3.5 w-3.5 mr-1" />}
            {label}
          </Button>
        ))}
      </div>
      <div className="space-y-4">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune question dans cette catégorie.</p>
        )}
        {list.map((q) => (
          <Card key={q.id}>
            <CardContent className="p-4 sm:p-6">
              <QuestionView question={q} index={questions.indexOf(q)} total={questions.length} selected={answers[q.id]} reveal />
            </CardContent>
          </Card>
        ))}
      </div>
    </AmfShell>
  );
}

function CategoryScore({ label, score, total, pass }: { label: string; score: number; total: number; pass: boolean }) {
  const p = Math.round((score / total) * 100);
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <Badge variant={pass ? "default" : "destructive"}>{pass ? "Validée" : "Non validée"}</Badge>
      </div>
      <p className="text-2xl font-bold tabular-nums">{p} %</p>
      <p className="text-xs text-muted-foreground mb-2">
        {score}/{total} — minimum requis : {Math.ceil(total * EXAM_FORMAT.passRate)}
      </p>
      <div className="relative">
        <Progress value={p} className="h-2" />
        <span className="absolute top-[-3px] h-[14px] w-0.5 bg-foreground/60" style={{ left: "80%" }} aria-hidden="true" />
      </div>
    </div>
  );
}
