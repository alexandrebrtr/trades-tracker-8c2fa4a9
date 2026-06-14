import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { Brain, Send, Loader2, PieChart, Trophy, CalendarDays, CalendarRange, TrendingUp, Square } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  conversationId: string;
  activeAccountId: string | null;
  onActivity: (conversationId: string, title?: string) => void;
}

const QUICK_ACTIONS = [
  { label: "Analyse de mon portefeuille", icon: PieChart, prompt: "Fais une analyse complète et détaillée de mon portefeuille : performance globale, rendement, diversification, exposition sectorielle et géographique, concentration du risque, volatilité et corrélations. Termine par des recommandations concrètes." },
  { label: "Analyse Prop Firm", icon: Trophy, prompt: "Analyse mon compte Prop Firm actif : progression vers l'objectif, drawdown restant, drawdown journalier, cohérence du risque, respect des règles, et estime ma probabilité de réussite avec des conseils précis." },
  { label: "Rapport hebdomadaire", icon: CalendarDays, prompt: "Génère un rapport hebdomadaire structuré de mes performances de trading et d'investissement, avec les points forts, les points faibles et un plan d'action pour la semaine à venir." },
  { label: "Rapport mensuel", icon: CalendarRange, prompt: "Génère un rapport mensuel complet de mes performances : statistiques clés, évolution du capital, meilleurs et pires actifs/stratégies, et axes d'amélioration." },
  { label: "Opportunités du marché", icon: TrendingUp, prompt: "En te basant sur mon profil, mon profil de risque et mes préférences, quelles opportunités de marché et quels ETF/actifs pourrais-je envisager pour améliorer mon allocation ? Reste éducatif." },
];

export function ChatPanel({ conversationId, activeAccountId, onActivity }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history for this conversation
  useEffect(() => {
    let active = true;
    setLoadingHistory(true);
    setMessages([]);
    setStreamingText("");
    supabase
      .from("ai_messages" as any)
      .select("id, role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }: any) => {
        if (!active) return;
        setMessages((data || []) as unknown as Message[]);
        setLoadingHistory(false);
      });
    return () => {
      active = false;
      abortRef.current?.abort();
    };
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streamingText]);

  // Keep focus
  useEffect(() => {
    if (!streaming && !loadingHistory) textareaRef.current?.focus();
  }, [streaming, loadingHistory, conversationId]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming || !user) return;

      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");
      setStreaming(true);
      setStreamingText("");

      // Persist user message + maybe set title
      const isFirst = messages.length === 0;
      await supabase.from("ai_messages" as any).insert({
        conversation_id: conversationId,
        user_id: user.id,
        role: "user",
        content: trimmed,
      } as any);

      let newTitle: string | undefined;
      if (isFirst) {
        newTitle = trimmed.length > 48 ? trimmed.slice(0, 48) + "…" : trimmed;
        await supabase.from("ai_conversations" as any).update({ title: newTitle } as any).eq("id", conversationId);
      } else {
        await supabase.from("ai_conversations" as any).update({ updated_at: new Date().toISOString() } as any).eq("id", conversationId);
      }
      onActivity(conversationId, newTitle);

      // Stream from edge function
      let assistant = "";
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const controller = new AbortController();
        abortRef.current = controller;

        const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-advisor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token ?? ""}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          signal: controller.signal,
          body: JSON.stringify({
            messages: history.map((m) => ({ role: m.role, content: m.content })),
            activeAccountId,
          }),
        });

        if (!resp.ok) {
          let msg = "Une erreur est survenue.";
          try {
            const j = await resp.json();
            msg = j.error || msg;
          } catch (_e) { /* ignore */ }
          throw new Error(msg);
        }

        const reader = resp.body!.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistant += decoder.decode(value, { stream: true });
          setStreamingText(assistant);
        }
      } catch (e: any) {
        if (e.name === "AbortError") {
          // keep whatever was streamed
        } else {
          toast({ title: "Erreur IA", description: e.message, variant: "destructive" });
        }
      }

      abortRef.current = null;

      if (assistant.trim()) {
        const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: assistant };
        setMessages((prev) => [...prev, assistantMsg]);
        await supabase.from("ai_messages" as any).insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: "assistant",
          content: assistant,
        } as any);
      }
      setStreamingText("");
      setStreaming(false);
    },
    [messages, streaming, user, conversationId, activeAccountId, onActivity, toast]
  );

  const stop = () => abortRef.current?.abort();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const showWelcome = !loadingHistory && messages.length === 0 && !streaming;

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="mx-auto max-w-3xl space-y-6 px-4 py-6">
          {loadingHistory && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {showWelcome && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
                <Brain className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Votre conseiller IA personnel</h2>
                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                  Connecté à vos comptes, vos trades et votre portefeuille en temps réel. Posez une question ou lancez une analyse.
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {QUICK_ACTIONS.map((a) => (
                  <Button key={a.label} variant="outline" size="sm" className="gap-2" onClick={() => send(a.prompt)}>
                    <a.icon className="h-4 w-4" />
                    {a.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <ChatMessage key={m.id} role={m.role} content={m.content} />
          ))}

          {streaming && <ChatMessage role="assistant" content={streamingText} streaming />}
        </div>
      </ScrollArea>

      <div className="border-t bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-3xl">
          {!showWelcome && (
            <div className="mb-2 flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((a) => (
                <Button
                  key={a.label}
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 border border-border/60 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                  disabled={streaming}
                  onClick={() => send(a.prompt)}
                >
                  <a.icon className="h-3.5 w-3.5" />
                  {a.label}
                </Button>
              ))}
            </div>
          )}
          <div className="relative flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Posez une question sur votre portefeuille, vos trades, votre Prop Firm…"
              rows={1}
              className="min-h-[48px] max-h-40 resize-none pr-2"
              disabled={streaming}
            />
            {streaming ? (
              <Button size="icon" variant="outline" onClick={stop} className="h-12 w-12 shrink-0" aria-label="Arrêter">
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="h-12 w-12 shrink-0"
                aria-label="Envoyer"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
            L'IA peut faire des erreurs. Ceci ne constitue pas un conseil financier réglementé.
          </p>
        </div>
      </div>
    </div>
  );
}
