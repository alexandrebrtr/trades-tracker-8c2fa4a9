import { useState } from "react";
import { Link } from "react-router-dom";
import { AmfShell } from "@/features/amf/components/AmfShell";
import { useAmfProgress } from "@/features/amf/progress";
import { ALL_QUESTIONS, THEMES } from "@/features/amf/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { RotateCcw, Shuffle, Target } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const SIZES = [10, 20, 40];

export default function AmfTraining() {
  const { progress, stats } = useAmfProgress();
  const [size, setSize] = useState(20);

  const scopeLabel = (scope: string) =>
    scope === "aleatoire"
      ? "Quiz aléatoire"
      : scope === "erreurs"
        ? "Révision des erreurs"
        : `Thème ${THEMES.find((t) => t.id === scope)?.number ?? "?"}`;

  return (
    <AmfShell>
      <h1 className="text-2xl font-bold mb-1">Entraînement</h1>
      <p className="text-muted-foreground mb-6">
        Mode entraînement : la correction et l'explication s'affichent après chaque réponse.
      </p>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-primary" /> Quiz aléatoire
            </CardTitle>
            <CardDescription>
              Questions tirées dans les {THEMES.length} thèmes ({ALL_QUESTIONS.length} au total).
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-md border p-0.5" role="group" aria-label="Nombre de questions">
              {SIZES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSize(n)}
                  aria-pressed={size === n}
                  className={cn(
                    "rounded px-3 py-1 text-sm tabular-nums",
                    size === n ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <Button asChild className="ml-auto">
              <Link to={`/amf/quiz/aleatoire?n=${size}`}>Lancer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-primary" /> Revoir mes erreurs
            </CardTitle>
            <CardDescription>
              {stats.mistakes.length
                ? `${stats.mistakes.length} question(s) dont votre dernière réponse était fausse.`
                : "Aucune erreur enregistrée : faites quelques quiz d'abord."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" disabled={!stats.mistakes.length} className="w-full sm:w-auto">
              {stats.mistakes.length ? (
                <Link to="/amf/quiz/erreurs">Réviser mes erreurs</Link>
              ) : (
                <span>Réviser mes erreurs</span>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-semibold mb-3">Quiz par thème</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {THEMES.map((t, i) => {
          const s = stats.perTheme[i];
          return (
            <Link key={t.id} to={`/amf/quiz/${t.id}`}>
              <Card className="h-full transition-colors hover:border-primary/60 hover:bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {t.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{t.shortTitle}</p>
                      <p className="text-xs text-muted-foreground mb-2">{t.questions.length} questions</p>
                      <Progress value={s.masteryPct} className="h-1.5" />
                      <p className="mt-1 text-xs text-muted-foreground">
                        {s.mastered}/{s.totalQuestions} maîtrisées
                      </p>
                    </div>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {progress.quizHistory.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3">Derniers quiz</h2>
          <Card>
            <CardContent className="p-0 divide-y">
              {progress.quizHistory.slice(0, 8).map((q) => {
                const p = Math.round((q.score / q.total) * 100);
                return (
                  <div key={q.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <span className="flex-1">{scopeLabel(q.scope)}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {format(new Date(q.date), "d MMM, HH:mm", { locale: fr })}
                    </span>
                    <span
                      className={cn(
                        "w-20 text-right font-medium tabular-nums",
                        p >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
                      )}
                    >
                      {q.score}/{q.total} · {p} %
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </AmfShell>
  );
}
