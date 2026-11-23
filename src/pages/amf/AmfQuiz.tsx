import { useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { AmfShell } from "@/features/amf/components/AmfShell";
import { QuestionView } from "@/features/amf/components/QuestionView";
import { drawBalanced, prepare, shuffle, useAmfProgress, PreparedQuestion } from "@/features/amf/progress";
import { ALL_QUESTIONS, THEMES, getTheme } from "@/features/amf/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen, ChevronLeft, RotateCcw, Trophy } from "lucide-react";

export default function AmfQuiz() {
  const { scope = "aleatoire" } = useParams();
  const [params] = useSearchParams();
  const { stats } = useAmfProgress();
  const theme = getTheme(scope);
  const isValid = !!theme || scope === "aleatoire" || scope === "erreurs";
  const n = Math.min(Math.max(Number(params.get("n")) || 20, 5), 60);
  // Clé de session : relancer un quiz régénère un tirage
  const [session, setSession] = useState(0);

  const questions = useMemo<PreparedQuestion[]>(() => {
    if (theme) return shuffle(theme.questions).map(prepare);
    if (scope === "erreurs") return shuffle(stats.mistakes).slice(0, 40).map(prepare);
    return drawBalanced(ALL_QUESTIONS, n).map(prepare);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, n, session]);

  if (!isValid) return <Navigate to="/amf/entrainement" replace />;

  const title = theme
    ? `Quiz · Thème ${theme.number} — ${theme.shortTitle}`
    : scope === "erreurs"
      ? "Révision de mes erreurs"
      : "Quiz aléatoire";

  if (!questions.length) {
    return (
      <AmfShell>
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <p className="font-medium">Aucune question à réviser pour le moment.</p>
            <Button asChild>
              <Link to="/amf/entrainement">Retour à l'entraînement</Link>
            </Button>
          </CardContent>
        </Card>
      </AmfShell>
    );
  }

  return (
    <QuizRunner
      key={`${scope}-${session}`}
      title={title}
      scope={scope}
      themeId={theme?.id}
      questions={questions}
      onRestart={() => setSession((s) => s + 1)}
    />
  );
}

function QuizRunner({
  title, scope, themeId, questions, onRestart,
}: {
  title: string;
  scope: string;
  themeId?: string;
  questions: PreparedQuestion[];
  onRestart: () => void;
}) {
  const { recordAnswers, recordQuiz } = useAmfProgress();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | undefined>();
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const q = questions[idx];
  const score = questions.filter((x) => answers[x.id] === x.answer).length;

  const validate = () => {
    if (selected === undefined) return;
    setAnswers((a) => ({ ...a, [q.id]: selected }));
    recordAnswers([{ questionId: q.id, correct: selected === q.answer }]);
    setRevealed(true);
  };

  const next = () => {
    if (idx === questions.length - 1) {
      const finalScore = questions.filter((x) => (x.id === q.id ? selected : answers[x.id]) === x.answer).length;
      recordQuiz({ scope, score: finalScore, total: questions.length });
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setSelected(undefined);
    setRevealed(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const wrong = questions.filter((x) => answers[x.id] !== x.answer);
    const theme = getTheme(themeId);
    const nextTheme = theme ? THEMES[THEMES.findIndex((t) => t.id === theme.id) + 1] : undefined;
    return (
      <AmfShell>
        <Card className="mb-6">
          <CardContent className="p-6 sm:p-8 text-center">
            <Trophy className={cn("mx-auto mb-3 h-10 w-10", pct >= 80 ? "text-amber-500" : "text-muted-foreground")} />
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="my-2 text-4xl font-bold tabular-nums">{pct} %</p>
            <p className="text-muted-foreground mb-4">
              {score} bonne(s) réponse(s) sur {questions.length}
              {pct >= 80 ? " — objectif de 80 % atteint 🎯" : " — l'objectif est de 80 %"}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={onRestart} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" /> Recommencer
              </Button>
              {theme && (
                <Button asChild variant="outline">
                  <Link to={`/amf/cours/${theme.id}`}>
                    <BookOpen className="h-4 w-4 mr-2" /> Revoir le cours
                  </Link>
                </Button>
              )}
              {nextTheme ? (
                <Button asChild>
                  <Link to={`/amf/cours/${nextTheme.id}`}>
                    Thème suivant <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/amf/entrainement">Retour à l'entraînement</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {wrong.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-3">Questions à retravailler ({wrong.length})</h2>
            <div className="space-y-4">
              {wrong.map((x) => (
                <Card key={x.id}>
                  <CardContent className="p-4 sm:p-6">
                    <QuestionView question={x} selected={answers[x.id]} reveal />
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </AmfShell>
    );
  }

  return (
    <AmfShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link to="/amf/entrainement" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
            <ChevronLeft className="h-4 w-4" /> Quitter
          </Link>
          <span className="text-sm text-muted-foreground tabular-nums">
            Score : {score}/{Object.keys(answers).length}
          </span>
        </div>
        <h1 className="text-lg font-semibold mb-2">{title}</h1>
        <Progress value={((idx + (revealed ? 1 : 0)) / questions.length) * 100} className="mb-6 h-1.5" />

        <Card>
          <CardContent className="p-4 sm:p-6">
            <QuestionView
              question={q}
              index={idx}
              total={questions.length}
              selected={selected}
              onSelect={setSelected}
              reveal={revealed}
              showTheme={!themeId}
            />
            <div className="mt-6 flex justify-end">
              {!revealed ? (
                <Button onClick={validate} disabled={selected === undefined}>
                  Valider
                </Button>
              ) : (
                <Button onClick={next}>
                  {idx === questions.length - 1 ? "Voir mon résultat" : "Question suivante"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AmfShell>
  );
}
