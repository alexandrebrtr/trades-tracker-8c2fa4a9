import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Lightbulb, Flag } from "lucide-react";
import { PreparedQuestion } from "../progress";
import { getTheme } from "../data";

const LETTERS = ["A", "B", "C", "D", "E"];

interface Props {
  question: PreparedQuestion;
  /** Index (dans options) choisi par l'utilisateur */
  selected?: number;
  onSelect?: (optionIndex: number) => void;
  /** Affiche la correction */
  reveal?: boolean;
  index?: number;
  total?: number;
  flagged?: boolean;
  onToggleFlag?: () => void;
  showTheme?: boolean;
}

export function QuestionView({
  question,
  selected,
  onSelect,
  reveal = false,
  index,
  total,
  flagged,
  onToggleFlag,
  showTheme = true,
}: Props) {
  const theme = getTheme(question.themeId);
  const isCorrect = selected === question.answer;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {index !== undefined && total !== undefined && (
          <span className="font-medium text-foreground">
            Question {index + 1} / {total}
          </span>
        )}
        <Badge variant={question.category === "A" ? "default" : "secondary"} className="text-[10px]">
          Catégorie {question.category}
        </Badge>
        {showTheme && theme && (
          <span className="truncate">
            Thème {theme.number} · {theme.shortTitle}
          </span>
        )}
        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            className={cn(
              "ml-auto inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors",
              flagged ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "hover:bg-muted",
            )}
            aria-pressed={flagged}
          >
            <Flag className="h-3.5 w-3.5" aria-hidden="true" />
            {flagged ? "Marquée" : "Marquer pour revoir"}
          </button>
        )}
      </div>

      <h2 className="text-lg sm:text-xl font-semibold leading-snug">{question.question}</h2>

      <div className="grid gap-2.5" role="radiogroup" aria-label="Propositions">
        {question.order.map((optIdx, pos) => {
          const chosen = selected === optIdx;
          const good = reveal && optIdx === question.answer;
          const wrong = reveal && chosen && optIdx !== question.answer;
          return (
            <button
              key={optIdx}
              type="button"
              role="radio"
              aria-checked={chosen}
              disabled={reveal || !onSelect}
              onClick={() => onSelect?.(optIdx)}
              className={cn(
                "group flex w-full items-start gap-3 rounded-lg border p-3 sm:p-4 text-left text-sm sm:text-base transition-all",
                "disabled:cursor-default",
                !reveal && "hover:border-primary/60 hover:bg-primary/5",
                chosen && !reveal && "border-primary bg-primary/10 ring-1 ring-primary",
                good && "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500",
                wrong && "border-red-500 bg-red-500/10 ring-1 ring-red-500",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  chosen && !reveal && "border-primary bg-primary text-primary-foreground",
                  good && "border-emerald-500 bg-emerald-500 text-white",
                  wrong && "border-red-500 bg-red-500 text-white",
                )}
              >
                {LETTERS[pos]}
              </span>
              <span className="flex-1 pt-0.5">{question.options[optIdx]}</span>
              {good && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-label="Bonne réponse" />}
              {wrong && <XCircle className="h-5 w-5 shrink-0 text-red-500" aria-label="Votre réponse" />}
            </button>
          );
        })}
      </div>

      {reveal && (
        <div
          className={cn(
            "rounded-lg border p-4 text-sm",
            selected === undefined
              ? "border-muted bg-muted/40"
              : isCorrect
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-red-500/40 bg-red-500/5",
          )}
        >
          <p className="mb-1 flex items-center gap-2 font-semibold">
            <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden="true" />
            {selected === undefined ? "Non répondue" : isCorrect ? "Bonne réponse !" : "Mauvaise réponse"}
          </p>
          <p className="text-muted-foreground">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
