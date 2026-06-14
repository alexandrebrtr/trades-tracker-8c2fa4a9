import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

type Msg = { role: "user" | "assistant" | "system"; content: string };

const n = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : Number(v) || 0);
const round = (v: number, d = 2) => {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
};

function summarizeTrades(trades: any[]) {
  const closed = trades.filter((t) => t.pnl !== null && t.pnl !== undefined);
  const wins = closed.filter((t) => n(t.pnl) > 0);
  const losses = closed.filter((t) => n(t.pnl) < 0);
  const totalPnl = closed.reduce((s, t) => s + n(t.pnl), 0);
  const grossWin = wins.reduce((s, t) => s + n(t.pnl), 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + n(t.pnl), 0));
  const winRate = closed.length ? (wins.length / closed.length) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0;

  // Exposure by asset
  const byAsset: Record<string, { count: number; pnl: number }> = {};
  const byStrategy: Record<string, { count: number; pnl: number }> = {};
  for (const t of closed) {
    const a = t.symbol || t.asset || t.pair || "N/A";
    const s = t.strategy || "N/A";
    byAsset[a] = byAsset[a] || { count: 0, pnl: 0 };
    byAsset[a].count++; byAsset[a].pnl += n(t.pnl);
    byStrategy[s] = byStrategy[s] || { count: 0, pnl: 0 };
    byStrategy[s].count++; byStrategy[s].pnl += n(t.pnl);
  }

  return {
    totalTrades: closed.length,
    wins: wins.length,
    losses: losses.length,
    winRate: round(winRate),
    totalPnl: round(totalPnl),
    avgWin: wins.length ? round(grossWin / wins.length) : 0,
    avgLoss: losses.length ? round(grossLoss / losses.length) : 0,
    profitFactor: profitFactor === Infinity ? "∞" : round(profitFactor),
    byAsset: Object.entries(byAsset)
      .map(([k, v]) => ({ asset: k, trades: v.count, pnl: round(v.pnl) }))
      .sort((a, b) => b.trades - a.trades)
      .slice(0, 15),
    byStrategy: Object.entries(byStrategy)
      .map(([k, v]) => ({ strategy: k, trades: v.count, pnl: round(v.pnl) }))
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 10),
  };
}

async function buildContext(supabase: any, userId: string, activeAccountId: string | null) {
  const [accountsRes, profileRes, memoryRes, allocRes] = await Promise.all([
    supabase.from("trading_accounts").select("*").eq("user_id", userId),
    supabase.from("profiles").select("username, balance, currency, premium, premium_expires").eq("id", userId).maybeSingle(),
    supabase.from("ai_user_memory").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("asset_allocations").select("*").eq("user_id", userId),
  ]);

  const accounts = accountsRes.data || [];
  const active = accounts.find((a: any) => a.id === activeAccountId) || accounts.find((a: any) => a.is_default) || accounts[0] || null;

  let activeTrades: any[] = [];
  let activeTx: any[] = [];
  if (active) {
    const [tRes, txRes] = await Promise.all([
      supabase.from("trades").select("*").eq("account_id", active.id).order("created_at", { ascending: false }).limit(400),
      supabase.from("transactions").select("type, amount, created_at, notes").eq("account_id", active.id).order("created_at", { ascending: false }).limit(200),
    ]);
    activeTrades = tRes.data || [];
    activeTx = txRes.data || [];
  }

  const deposits = activeTx.filter((t) => t.type === "deposit").reduce((s, t) => s + n(t.amount), 0);
  const withdrawals = activeTx.filter((t) => t.type === "withdrawal").reduce((s, t) => s + n(t.amount), 0);

  const tradeSummary = summarizeTrades(activeTrades);

  // Prop firm progress for active account
  let propFirm: any = null;
  if (active && active.account_type === "prop_firm") {
    const initial = n(active.initial_capital);
    const balance = n(active.balance);
    const profit = balance - initial;
    const target = active.profit_target ? n(active.profit_target) : null;
    const maxDD = active.max_drawdown ? n(active.max_drawdown) : null;
    propFirm = {
      status: active.prop_firm_status,
      initialCapital: initial,
      currentBalance: round(balance),
      profit: round(profit),
      profitTarget: target,
      progressToTargetPct: target ? round((profit / target) * 100) : null,
      maxDrawdownLimit: maxDD,
      dailyDrawdownLimit: active.daily_drawdown ? n(active.daily_drawdown) : null,
      drawdownRemaining: maxDD ? round(maxDD - Math.max(0, initial - balance)) : null,
    };
  }

  return {
    profile: profileRes.data || null,
    memory: memoryRes.data || null,
    accountsOverview: accounts.map((a: any) => ({
      id: a.id, name: a.name, type: a.account_type, currency: a.currency,
      balance: round(n(a.balance)), initialCapital: n(a.initial_capital),
      propFirmStatus: a.prop_firm_status, archived: a.archived,
    })),
    activeAccount: active
      ? {
          name: active.name, type: active.account_type, currency: active.currency,
          balance: round(n(active.balance)), initialCapital: n(active.initial_capital),
          leverage: active.leverage, deposits: round(deposits), withdrawals: round(withdrawals),
        }
      : null,
    activeAccountPerformance: tradeSummary,
    assetAllocation: (allocRes.data || []).map((a: any) => ({
      asset: a.asset_name || a.name || a.category, value: n(a.value ?? a.amount), pct: n(a.percentage),
    })),
    propFirm,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Session invalide" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userId = userData.user.id;

    const body = await req.json();
    const messages: Msg[] = Array.isArray(body.messages) ? body.messages : [];
    const activeAccountId: string | null = body.activeAccountId || null;

    const context = await buildContext(supabase, userId, activeAccountId);

    const systemPrompt = `Tu es "AI Advisor", l'assistant financier personnel et privé de cet utilisateur sur la plateforme Trades Tracker.

Ton rôle combine: conseiller en investissement, analyste financier, analyste macroéconomique, coach Prop Firm et assistant personnel financier.

RÈGLES IMPORTANTES:
- Réponds TOUJOURS en français (sauf si l'utilisateur écrit dans une autre langue).
- Utilise EXCLUSIVEMENT les données réelles de l'utilisateur fournies ci-dessous. Ne donne jamais de réponses génériques quand des données sont disponibles.
- Sois précis, chiffré et actionnable. Cite les vrais chiffres (soldes, PnL, win rate, drawdown...).
- Structure tes réponses en Markdown (titres ##, listes, **gras**). Utilise des tableaux Markdown pour comparer des données.
- Pour les analyses de performance: commente rendement, diversification, exposition (actifs/secteurs), concentration du risque, win rate, profit factor.
- Pour les Prop Firms: analyse progression vers l'objectif, drawdown restant, cohérence du risque, et estime une probabilité de réussite réaliste.
- Tu peux donner des avis éducatifs sur des marchés/actifs, mais rappelle que ce ne sont pas des conseils financiers réglementés.
- Si une donnée manque, dis-le clairement et propose à l'utilisateur de l'ajouter.

DONNÉES DE L'UTILISATEUR (JSON, temps réel):
${JSON.stringify(context, null, 2)}`;

    const aiMessages: Msg[] = [
      { role: "system", content: systemPrompt },
      ...messages.filter((m) => m.role === "user" || m.role === "assistant").slice(-20),
    ];

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un instant." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "Crédits IA épuisés. Veuillez recharger votre espace de travail." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!aiResp.ok || !aiResp.body) {
      const txt = await aiResp.text();
      console.error("AI gateway error", aiResp.status, txt);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Transform OpenAI-style SSE into a plain text stream of content deltas
    const reader = aiResp.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let idx;
            while ((idx = buffer.indexOf("\n")) !== -1) {
              const line = buffer.slice(0, idx).trim();
              buffer = buffer.slice(idx + 1);
              if (!line.startsWith("data:")) continue;
              const data = line.slice(5).trim();
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const delta = json.choices?.[0]?.delta?.content;
                if (delta) controller.enqueue(encoder.encode(delta));
              } catch {
                // ignore partial json
              }
            }
          }
          controller.close();
        } catch (e) {
          console.error("stream error", e);
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error("ai-advisor error", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
