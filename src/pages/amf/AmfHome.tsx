import { Link } from "react-router-dom";
import { AmfShell } from "@/features/amf/components/AmfShell";
import { useAmfProgress } from "@/features/amf/progress";
import { ALL_QUESTIONS, EXAM_FORMAT, THEMES } from "@/features/amf/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Clock, GraduationCap, ListChecks, RotateCcw, Shuffle, Target, Trophy, CheckCircle2, XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function AmfHome() {
  const { progress, stats } = useAmfProgress();
  const lastExam = progress.examHistory[0];
  const bestExam = [...progress.examHistory].sort(
    (a, b) => (b.scoreA + b.scoreC) / (b.totalA + b.totalC) - (a.scoreA + a.scoreC) / (a.totalA + a.totalC),
  )[0];

  // Prochaine étape conseillée : premier thème dont le cours n'est pas terminé
  const nextTheme = THEMES.find((t, i) => stats.perTheme[i].coursePct < 100) ?? THEMES[0];

  return (
    <AmfShell>
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Badge variant="outline" className="mb-3">Académie AMF</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Préparez la certification AMF
          </h1>
          <p className="text-muted-foreground mb-5 max-w-prose">
            {THEMES.length} thèmes du programme, {ALL_QUESTIONS.length} questions corrigées et commentées,
            des examens blancs en conditions réelles et un suivi de votre progression.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to={`/amf/cours/${nextTheme.id}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                {stats.coursePct > 0 ? "Reprendre les cours" : "Commencer les cours"}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/amf/examen">
                <GraduationCap className="h-4 w-4 mr-2" /> Passer un examen blanc
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Format de l'examen</CardTitle>
            <CardDescription>Examen certifié AMF, format en vigueur</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Fact icon={<ListChecks className="h-4 w-4" />} label="Questions" value={`${EXAM_FORMAT.questions} QCM`} />
            <Fact icon={<Clock className="h-4 w-4" />} label="Durée" value="2 heures" />
            <Fact icon={<Target className="h-4 w-4" />} label="Catégorie A" value={`${EXAM_FORMAT.categoryA} questions`} />
            <Fact icon={<Target className="h-4 w-4" />} label="Catégorie C" value={`${EXAM_FORMAT.categoryC} questions`} />
            <p className="col-span-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              Réussite : <strong className="text-foreground">80 % de bonnes réponses dans chaque catégorie</strong>,
              sans compensation entre A et C.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Cours lus" value={`${stats.coursePct} %`} progress={stats.coursePct} />
        <StatCard
          label="Questions maîtrisées"
          value={`${stats.totalMastered} / ${ALL_QUESTIONS.length}`}
          progress={stats.masteryPct}
        />
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Dernier examen blanc</p>
            {lastExam ? (
              <>
                <p className="text-xl font-semibold flex items-center gap-2">
                  {lastExam.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {lastExam.passed ? "Réussi" : "Échoué"}
                </p>
                <p className="text-xs text-muted-foreground">
                  A : {pct(lastExam.scoreA, lastExam.totalA)} % · C : {pct(lastExam.scoreC, lastExam.totalC)} %
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun examen passé</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Meilleur score</p>
            {bestExam ? (
              <p className="text-xl font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                {pct(bestExam.scoreA + bestExam.scoreC, bestExam.totalA + bestExam.totalC)} %
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
            <p className="text-xs text-muted-foreground">{progress.examHistory.length} examen(s) passé(s)</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        <QuickAction
          to="/amf/quiz/aleatoire"
          icon={<Shuffle className="h-5 w-5" />}
          title="Quiz aléatoire"
          text="20 questions tirées dans tout le programme"
        />
        <QuickAction
          to="/amf/quiz/erreurs"
          icon={<RotateCcw className="h-5 w-5" />}
          title="Revoir mes erreurs"
          text={
            stats.mistakes.length
              ? `${stats.mistakes.length} question(s) à retravailler`
              : "Aucune erreur enregistrée pour l'instant"
          }
          disabled={!stats.mistakes.length}
        />
        <QuickAction
          to="/amf/fiches"
          icon={<ListChecks className="h-5 w-5" />}
          title="Fiches de révision"
          text="L'essentiel de chaque thème et le glossaire"
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Les {THEMES.length} thèmes du programme</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {THEMES.map((t, i) => {
            const s = stats.perTheme[i];
            return (
              <Card key={t.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant="secondary">Thème {t.number}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {t.duration} min
                    </span>
                  </div>
                  <CardTitle className="text-base leading-snug">{t.shortTitle}</CardTitle>
                  <CardDescription className="line-clamp-2">{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-3">
                  <ProgressLine label="Cours" value={s.coursePct} detail={`${s.read}/${s.totalSections}`} />
                  <ProgressLine label="Maîtrise" value={s.masteryPct} detail={`${s.mastered}/${s.totalQuestions}`} />
                  <div className="flex gap-2 pt-1">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link to={`/amf/cours/${t.id}`}>Cours</Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/amf/quiz/${t.id}`}>Quiz</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {progress.examHistory.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Historique des examens blancs</h2>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Format</th>
                    <th className="px-4 py-2 font-medium">Catégorie A</th>
                    <th className="px-4 py-2 font-medium">Catégorie C</th>
                    <th className="px-4 py-2 font-medium">Résultat</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.examHistory.slice(0, 10).map((e) => (
                    <tr key={e.id} className="border-b last:border-0">
                      <td className="px-4 py-2 whitespace-nowrap">
                        {format(new Date(e.date), "d MMM yyyy, HH:mm", { locale: fr })}
                      </td>
                      <td className="px-4 py-2">{e.mode === "complet" ? "Complet" : "Express"}</td>
                      <td className="px-4 py-2 tabular-nums">{pct(e.scoreA, e.totalA)} %</td>
                      <td className="px-4 py-2 tabular-nums">{pct(e.scoreC, e.totalC)} %</td>
                      <td className="px-4 py-2">
                        <Badge variant={e.passed ? "default" : "destructive"}>{e.passed ? "Réussi" : "Échoué"}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}
    </AmfShell>
  );
}

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-xl font-semibold mb-2 tabular-nums">{value}</p>
        <Progress value={progress} className="h-1.5" />
      </CardContent>
    </Card>
  );
}

function ProgressLine({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums">{detail}</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

function QuickAction({
  to, icon, title, text, disabled,
}: { to: string; icon: React.ReactNode; title: string; text: string; disabled?: boolean }) {
  const inner = (
    <Card className={disabled ? "opacity-60" : "transition-colors hover:border-primary/60 hover:bg-primary/5"}>
      <CardContent className="p-4 flex items-start gap-3">
        <span className="rounded-md bg-primary/10 p-2 text-primary">{icon}</span>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{text}</p>
        </div>
      </CardContent>
    </Card>
  );
  return disabled ? <div aria-disabled="true">{inner}</div> : <Link to={to}>{inner}</Link>;
}
