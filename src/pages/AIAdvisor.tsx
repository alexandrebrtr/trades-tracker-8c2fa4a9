import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useAccount } from "@/context/AccountContext";
import { useToast } from "@/components/ui/use-toast";
import { ConversationSidebar, Conversation } from "@/components/ai/ConversationSidebar";
import { ChatPanel } from "@/components/ai/ChatPanel";
import { MemoryDialog } from "@/components/ai/MemoryDialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, Brain, PanelLeft } from "lucide-react";

export default function AIAdvisor() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeAccountId } = useAccount();
  const { toast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const creatingRef = useRef(false);

  const loadConversations = useCallback(async () => {
    if (!user) return [];
    const { data } = await supabase
      .from("ai_conversations" as any)
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    const list = (data || []) as unknown as Conversation[];
    setConversations(list);
    return list;
  }, [user]);

  const createConversation = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("ai_conversations" as any)
      .insert({ user_id: user.id, title: "Nouvelle conversation", account_id: activeAccountId } as any)
      .select("id, title, updated_at")
      .single();
    if (error || !data) {
      toast({ title: "Erreur", description: error?.message || "Impossible de créer la conversation", variant: "destructive" });
      return null;
    }
    setConversations((prev) => [data as unknown as Conversation, ...prev]);
    return (data as unknown as Conversation).id;
  }, [user, activeAccountId, toast]);

  // Bootstrap: load conversations and ensure an active conversation
  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setLoading(true);
      const list = await loadConversations();
      if (!active) return;

      if (conversationId && list.some((c) => c.id === conversationId)) {
        setLoading(false);
        return;
      }
      if (list.length > 0) {
        navigate(`/ai-advisor/${list[0].id}`, { replace: true });
        setLoading(false);
        return;
      }
      // none exist -> create one (guard against StrictMode double-run)
      if (!creatingRef.current) {
        creatingRef.current = true;
        const id = await createConversation();
        creatingRef.current = false;
        if (id && active) navigate(`/ai-advisor/${id}`, { replace: true });
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, conversationId]);

  const handleNew = async () => {
    const id = await createConversation();
    if (id) {
      setMobileNavOpen(false);
      navigate(`/ai-advisor/${id}`);
    }
  };

  const handleSelect = (id: string) => {
    setMobileNavOpen(false);
    navigate(`/ai-advisor/${id}`);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("ai_conversations" as any).delete().eq("id", id);
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);
    if (id === conversationId) {
      if (remaining.length > 0) navigate(`/ai-advisor/${remaining[0].id}`, { replace: true });
      else navigate("/ai-advisor", { replace: true });
    }
  };

  const handleActivity = useCallback((id: string, title?: string) => {
    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, title: title ?? c.title, updated_at: new Date().toISOString() } : c
      );
      return [...updated].sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
    });
  }, []);

  const sidebar = (
    <ConversationSidebar
      conversations={conversations}
      activeId={conversationId ?? null}
      onSelect={handleSelect}
      onNew={handleNew}
      onDelete={handleDelete}
      onOpenMemory={() => setMemoryOpen(true)}
    />
  );

  return (
    <AppLayout>
      <div className="-mr-3 md:-mr-6 -mb-3 md:-mb-6">
        <div className="flex h-[calc(100vh-7rem)] min-h-[480px] overflow-hidden rounded-lg border bg-card">
          {/* Desktop conversation sidebar */}
          <aside className="hidden w-72 shrink-0 flex-col border-r bg-muted/30 p-3 md:flex">
            <div className="mb-3 flex items-center gap-2 px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-none">AI Advisor</h1>
                <p className="text-[11px] text-muted-foreground">Conseiller financier IA</p>
              </div>
            </div>
            {sidebar}
          </aside>

          {/* Chat area */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Mobile header */}
            <div className="flex items-center gap-2 border-b px-3 py-2 md:hidden">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <PanelLeft className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-3">
                  <div className="mb-3 mt-2 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h1 className="text-sm font-semibold">AI Advisor</h1>
                  </div>
                  {sidebar}
                </SheetContent>
              </Sheet>
              <span className="text-sm font-medium">AI Advisor</span>
            </div>

            {loading || !conversationId ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ChatPanel
                key={conversationId}
                conversationId={conversationId}
                activeAccountId={activeAccountId}
                onActivity={handleActivity}
              />
            )}
          </div>
        </div>
      </div>

      <MemoryDialog open={memoryOpen} onOpenChange={setMemoryOpen} />
    </AppLayout>
  );
}
