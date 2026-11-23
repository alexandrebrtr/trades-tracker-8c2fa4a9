import { useEffect, useRef } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AmfShell } from "@/features/amf/components/AmfShell";
import { Markdown } from "@/features/amf/components/Markdown";
import { useAmfProgress } from "@/features/amf/progress";
import { THEMES, getTheme, sectionKey } from "@/features/amf/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Sparkles, Target } from "lucide-react";

export default function AmfCourse() {
  const { themeId } = useParams();
  if (!themeId) return <CourseIndex />;
  const theme = getTheme(themeId);
  if (!theme) return <Navigate to="/amf/cours" replace />;
  return <CourseReader key={theme.id} themeId={theme.id} />;
}

function CourseIndex() {
  const { stats } = useAmfProgress();
  return (
    <AmfShell>
      <h1 className="text-2xl font-bold mb-1">Cours</h1>
      <p className="text-muted-foreground mb-6">
        Lisez chaque thème, marquez les sections terminées, puis validez vos acquis avec le quiz associé.
      </p>
      <div className="space-y-3">
        {THEMES.map((t, i) => {
          const s = stats.perTheme[i];
          return (
            <Link key={t.id} to={`/amf/cours/${t.id}`} className="block">
              <Card className="transition-colors hover:border-primary/60 hover:bg-primary/5">
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {t.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.sections.length} sections · {t.duration} min · {t.questions.length} questions
                    </p>
                  </div>
                  <div className="hidden sm:block w-32">
                    <Progress value={s.coursePct} className="h-1.5" />
                    <p className="mt-1 text-right text-xs text-muted-foreground tabular-nums">{s.coursePct} %</p>
                  </div>
                  {s.coursePct === 100 && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </AmfShell>
  );
}

function CourseReader({ themeId }: { themeId: string }) {
  const theme = getTheme(themeId)!;
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { progress, toggleSection } = useAmfProgress();
  const topRef = useRef<HTMLDivElement>(null);

  const sectionIdx = Math.max(
    0,
    theme.sections.findIndex((s) => s.id === params.get("section")),
  );
  const section = theme.sections[sectionIdx];
  const isRead = (sid: string) => progress.readSections.includes(sectionKey(theme.id, sid));
  const readCount = theme.sections.filter((s) => isRead(s.id)).length;
  const themeIdx = THEMES.findIndex((t) => t.id === theme.id);
  const nextTheme = THEMES[themeIdx + 1];

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [sectionIdx]);

  const goTo = (i: number) => setParams({ section: theme.sections[i].id });

  const completeAndNext = () => {
    toggleSection(theme.id, section.id, true);
    if (sectionIdx < theme.sections.length - 1) goTo(sectionIdx + 1);
  };

  const isLast = sectionIdx === theme.sections.length - 1;

  return (
    <AmfShell>
      <div ref={topRef} className="scroll-mt-20" />
      <div className="mb-6">
        <Link to="/amf/cours" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
          <ChevronLeft className="h-4 w-4" /> Tous les cours
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Thème {theme.number}</Badge>
          <span className="text-xs text-muted-foreground">
            {readCount}/{theme.sections.length} sections lues
          </span>
        </div>
        <h1 className="mt-2 text-xl sm:text-2xl font-bold leading-tight">{theme.title}</h1>
        <Progress value={(readCount / theme.sections.length) * 100} className="mt-3 h-1.5" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {theme.sections.map((s, i) => (
              <li key={s.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    i === sectionIdx ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground",
                  )}
                  aria-current={i === sectionIdx ? "step" : undefined}
                >
                  {isRead(s.id) ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-label="Lu" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0" aria-label="Non lu" />
                  )}
                  <span className="whitespace-nowrap lg:whitespace-normal">{s.title}</span>
                </button>
              </li>
            ))}
            <li className="shrink-0 lg:mt-2">
              <Link
                to={`/amf/quiz/${theme.id}`}
                className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm hover:border-primary hover:text-primary"
              >
                <Target className="h-4 w-4" /> Quiz du thème
              </Link>
            </li>
          </ol>
        </aside>

        <article className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            {sectionIdx + 1}. {section.title}
          </h2>
          <Markdown>{section.content}</Markdown>

          {section.keyPoints && section.keyPoints.length > 0 && (
            <Card className="mt-8 border-primary/30 bg-primary/5">
              <CardContent className="p-4 sm:p-5">
                <p className="mb-3 flex items-center gap-2 font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" /> À retenir
                </p>
                <ul className="space-y-2 text-sm">
                  {section.keyPoints.map((k) => (
                    <li key={k} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
            <Button variant="ghost" disabled={sectionIdx === 0} onClick={() => goTo(sectionIdx - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => toggleSection(theme.id, section.id)}
              >
                {isRead(section.id) ? "Marquer comme non lu" : "Marquer comme lu"}
              </Button>
              {!isLast ? (
                <Button onClick={completeAndNext}>
                  Section suivante <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    toggleSection(theme.id, section.id, true);
                    navigate(`/amf/quiz/${theme.id}`);
                  }}
                >
                  <Target className="h-4 w-4 mr-2" /> Terminer et passer le quiz
                </Button>
              )}
            </div>
          </div>

          {isLast && nextTheme && (
            <p className="mt-4 text-right text-sm text-muted-foreground">
              Thème suivant :{" "}
              <Link to={`/amf/cours/${nextTheme.id}`} className="text-primary hover:underline">
                {nextTheme.number}. {nextTheme.shortTitle}
              </Link>
            </p>
          )}
        </article>
      </div>
    </AmfShell>
  );
}
