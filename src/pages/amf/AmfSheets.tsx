import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AmfShell } from "@/features/amf/components/AmfShell";
import { THEMES, getTheme } from "@/features/amf/data";
import { GLOSSARY } from "@/features/amf/data/glossary";
import { shuffle } from "@/features/amf/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronLeft, ChevronRight, RotateCw, Search, Shuffle } from "lucide-react";

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function AmfSheets() {
  return (
    <AmfShell>
      <h1 className="text-2xl font-bold mb-1">Fiches & glossaire</h1>
      <p className="text-muted-foreground mb-6">
        L'essentiel à mémoriser avant l'examen, des cartes mémoire et le vocabulaire clé.
      </p>
      <Tabs defaultValue="fiches">
        <TabsList className="mb-4">
          <TabsTrigger value="fiches">Fiches de révision</TabsTrigger>
          <TabsTrigger value="cartes">Cartes mémoire</TabsTrigger>
          <TabsTrigger value="glossaire">Glossaire</TabsTrigger>
        </TabsList>
        <TabsContent value="fiches"><Sheets /></TabsContent>
        <TabsContent value="cartes"><Flashcards /></TabsContent>
        <TabsContent value="glossaire"><Glossary /></TabsContent>
      </Tabs>
    </AmfShell>
  );
}

function Sheets() {
  return (
    <Accordion type="multiple" className="space-y-2">
      {THEMES.map((t) => (
        <AccordionItem key={t.id} value={t.id} className="rounded-lg border px-4">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {t.number}
              </span>
              <span className="font-medium">{t.shortTitle}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pb-2">
              {t.sections.map((s) => (
                <div key={s.id}>
                  <p className="mb-2 text-sm font-semibold">{s.title}</p>
                  <ul className="space-y-1.5 text-sm">
                    {(s.keyPoints ?? []).map((k) => (
                      <li key={k} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button asChild size="sm" variant="outline"><Link to={`/amf/cours/${t.id}`}>Lire le cours</Link></Button>
                <Button asChild size="sm"><Link to={`/amf/quiz/${t.id}`}>Faire le quiz</Link></Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function Flashcards() {
  const [deck, setDeck] = useState(() => GLOSSARY);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = deck[i];
  const theme = getTheme(card.themeId);

  const go = (d: number) => {
    setFlipped(false);
    setI((x) => (x + d + deck.length) % deck.length);
  };

  return (
    <div className="mx-auto max-w-xl">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className={cn(
          "flex min-h-[220px] w-full flex-col items-center justify-center rounded-xl border-2 p-6 text-center transition-colors",
          flipped ? "border-primary bg-primary/5" : "hover:border-primary/50",
        )}
        aria-label={flipped ? "Afficher le terme" : "Afficher la définition"}
      >
        {theme && <Badge variant="secondary" className="mb-3">Thème {theme.number}</Badge>}
        {flipped ? (
          <p className="text-base leading-relaxed">{card.definition}</p>
        ) : (
          <p className="text-2xl font-bold">{card.term}</p>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          {flipped ? "Cliquez pour revoir le terme" : "Cliquez pour voir la définition"}
        </p>
      </button>
      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="Carte précédente">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground tabular-nums">{i + 1} / {deck.length}</span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setDeck(shuffle(GLOSSARY)); setI(0); setFlipped(false); }}
            aria-label="Mélanger"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setFlipped((f) => !f)} aria-label="Retourner">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="Carte suivante">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Glossary() {
  const [q, setQ] = useState("");
  const entries = useMemo(() => {
    const n = normalize(q.trim());
    return [...GLOSSARY]
      .sort((a, b) => a.term.localeCompare(b.term, "fr"))
      .filter((e) => !n || normalize(e.term).includes(n) || normalize(e.definition).includes(n));
  }, [q]);

  return (
    <div>
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un terme…"
          className="pl-9"
          aria-label="Rechercher dans le glossaire"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {entries.map((e) => {
          const t = getTheme(e.themeId);
          return (
            <Card key={e.term}>
              <CardContent className="p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="font-semibold">{e.term}</p>
                  {t && (
                    <Link to={`/amf/cours/${t.id}`} className="text-xs text-muted-foreground hover:text-primary whitespace-nowrap">
                      Thème {t.number}
                    </Link>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{e.definition}</p>
              </CardContent>
            </Card>
          );
        })}
        {entries.length === 0 && <p className="text-sm text-muted-foreground">Aucun résultat.</p>}
      </div>
    </div>
  );
}
