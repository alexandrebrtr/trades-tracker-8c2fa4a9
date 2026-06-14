-- AI Advisor: conversations
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Nouvelle conversation',
  account_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversations TO authenticated;
GRANT ALL ON public.ai_conversations TO service_role;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own ai conversations" ON public.ai_conversations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AI Advisor: messages
CREATE TABLE public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own ai messages" ON public.ai_messages
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_ai_messages_conversation ON public.ai_messages(conversation_id, created_at);

-- AI Advisor: per-user memory / profile
CREATE TABLE public.ai_user_memory (
  user_id UUID NOT NULL PRIMARY KEY,
  risk_profile TEXT,
  goals TEXT,
  preferences TEXT,
  notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_user_memory TO authenticated;
GRANT ALL ON public.ai_user_memory TO service_role;
ALTER TABLE public.ai_user_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own ai memory" ON public.ai_user_memory
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE TRIGGER trg_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_ai_user_memory_updated_at BEFORE UPDATE ON public.ai_user_memory
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();