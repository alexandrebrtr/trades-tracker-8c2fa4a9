import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAccount } from '@/context/AccountContext';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell, ReferenceLine,
} from 'recharts';
import { computeQuantMetrics, equityCurve } from '@/utils/quantStats';
import {
  Zap, Trophy, TrendingUp, TrendingDown, Target, Activity,
  Clock, Calendar, AlertTriangle, CheckCircle2, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SERIES_COLORS = ['hsl(var(--primary))', 'hsl(var(--profit))', 'hsl(var(--loss))', '#f59e0b', '#8b5cf6', '#06b6d4'];
const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const fmtCur = (v: number, ccy = 'EUR') =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: ccy, maximumFractionDigits: 0 }).format(v || 0);
const fmtPct = (v: number, d = 1) => `${(v ?? 0).toFixed(d)}%`;
const fmtNum = (v: number, d = 2) => (v ?? 0).toFixed(d);

interface StrategyData {
  name: string;
  trades: any[];
  metrics: ReturnType<typeof computeQuantMetrics>;
  equity: number[];
  stability: number; // 0..100
  avgDurationDays: number;
}

export default function StrategyAnalysis({ userId }: { userId?: string }) {
  const { activeAccountId, activeAccount } = useAccount();
  const ccy = activeAccount?.currency || 'EUR';
  const initialCapital = activeAccount?.initial_capital || 10000;
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      setLoading(true);
      const startDate = (() => {
        const n = new Date();
        if (period === 'month') return new Date(n.setMonth(n.getMonth() - 1));
        if (period === 'quarter') return new Date(n.setMonth(n.getMonth() - 3));
        if (period === 'year') return new Date(n.setFullYear(n.getFullYear() - 1));
        return new Date(2000, 0, 1);
      })();
      let q = supabase.from('trades').select('*').eq('user_id', userId)
        .gte('date', startDate.toISOString()).order('date', { ascending: true });
      if (activeAccountId) q = q.eq('account_id', activeAccountId);
      const { data } = await q;
      setTrades(data || []);
      setLoading(false);
    })();
  }, [userId, period, activeAccountId]);

  const strategies = useMemo<StrategyData[]>(() => {
    const groups = new Map<string, any[]>();
    for (const t of trades) {
      const k = t.strategy || 'Non définie';
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(t);
    }
    const out: StrategyData[] = [];
    for (const [name, tr] of groups) {
      const sorted = [...tr].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const pnls = sorted.map(t => Number(t.pnl) || 0);
      const eq = equityCurve(pnls, initialCapital);
      const metrics = computeQuantMetrics(sorted, initialCapital);
      // Stability score: ratio of positive months / variance penalty
      const cumReturns: number[] = [];
      let acc = 0;
      pnls.forEach(p => { acc += p; cumReturns.push(acc); });
      const positiveRatio = pnls.length ? pnls.filter(p => p > 0).length / pnls.length : 0;
      const stability = Math.min(100, Math.max(0,
        positiveRatio * 100 * 0.6 +
        Math.max(0, 40 - Math.min(40, metrics.maxDrawdownPct))
      ));
      // average duration in days: use date deltas if available
      const days = sorted.length > 1
        ? (new Date(sorted[sorted.length - 1].date).getTime() - new Date(sorted[0].date).getTime()) / 86400000 / sorted.length
        : 0;
      out.push({ name, trades: sorted, metrics, equity: eq, stability, avgDurationDays: days });
    }
    return out.sort((a, b) => b.metrics.totalReturn - a.metrics.totalReturn);
  }, [trades, initialCapital]);

  // Comparative equity series
  const compareSeries = useMemo(() => {
    const maxLen = Math.max(0, ...strategies.map(s => s.equity.length));
    return Array.from({ length: maxLen }, (_, i) => {
      const row: any = { idx: i };
      strategies.forEach(s => { row[s.name] = s.equity[i] ?? null; });
      return row;
    });
  }, [strategies]);

  // Radar normalised
  const radarData = useMemo(() => {
    if (!strategies.length) return [];
    const axes = ['Win Rate', 'Profit Factor', 'Sharpe', 'Recovery', 'Expectancy', 'Stabilité'];
    const max = {
      'Win Rate': 100,
      'Profit Factor': Math.max(3, ...strategies.map(s => s.metrics.profitFactor)),
      Sharpe: Math.max(2, ...strategies.map(s => s.metrics.sharpeRatio)),
      Recovery: Math.max(3, ...strategies.map(s => s.metrics.recoveryFactor)),
      Expectancy: Math.max(1, ...strategies.map(s => Math.abs(s.metrics.expectancy))),
      Stabilité: 100,
    } as Record<string, number>;
    return axes.map(axis => {
      const row: any = { axis };
      strategies.slice(0, 5).forEach(s => {
        let v = 0;
        if (axis === 'Win Rate') v = s.metrics.winRate;
        else if (axis === 'Profit Factor') v = s.metrics.profitFactor;
        else if (axis === 'Sharpe') v = Math.max(0, s.metrics.sharpeRatio);
        else if (axis === 'Recovery') v = Math.max(0, s.metrics.recoveryFactor);
        else if (axis === 'Expectancy') v = Math.max(0, s.metrics.expectancy);
        else if (axis === 'Stabilité') v = s.stability;
        row[s.name] = Math.min(100, (v / max[axis]) * 100);
      });
      return row;
    });
  }, [strategies]);

  // Behavioral: best hours / days / assets
  const behavior = useMemo(() => {
    const hours = new Map<number, { pnl: number; count: number }>();
    const days = new Map<number, { pnl: number; count: number }>();
    const assets = new Map<string, { pnl: number; count: number; wins: number }>();
    for (const t of trades) {
      const d = new Date(t.date); const pnl = Number(t.pnl) || 0;
      const h = d.getHours(), w = d.getDay();
      const ch = hours.get(h) || { pnl: 0, count: 0 }; ch.pnl += pnl; ch.count++; hours.set(h, ch);
      const cd = days.get(w) || { pnl: 0, count: 0 }; cd.pnl += pnl; cd.count++; days.set(w, cd);
      const sym = t.symbol || 'N/A';
      const ca = assets.get(sym) || { pnl: 0, count: 0, wins: 0 };
      ca.pnl += pnl; ca.count++; if (pnl > 0) ca.wins++; assets.set(sym, ca);
    }
    const topHours = Array.from(hours, ([hour, v]) => ({ label: `${hour}h`, ...v }))
      .sort((a, b) => b.pnl - a.pnl);
    const topDays = Array.from(days, ([d, v]) => ({ label: DAYS_FR[d], ...v }))
      .sort((a, b) => b.pnl - a.pnl);
    const topAssets = Array.from(assets, ([name, v]) => ({
      name, pnl: v.pnl, count: v.count, winRate: v.count ? (v.wins / v.count) * 100 : 0,
    })).sort((a, b) => b.pnl - a.pnl).slice(0, 8);
    return { topHours, topDays, topAssets };
  }, [trades]);

  // Loss patterns: longest losing streak per strategy, frequent losing setups
  const lossPatterns = useMemo(() => {
    return strategies.map(s => {
      const losses = s.trades.filter(t => (t.pnl || 0) < 0);
      const lossRate = s.trades.length ? (losses.length / s.trades.length) * 100 : 0;
      return {
        name: s.name,
        consecutiveLosses: s.metrics.consecutiveLosses,
        lossRate,
        avgLoss: s.metrics.avgLoss,
        risk: s.metrics.profitFactor < 1 ? 'Élevé' : s.metrics.profitFactor < 1.5 ? 'Modéré' : 'Faible',
      };
    });
  }, [strategies]);

  const tooltipStyle = {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 8,
    fontSize: 12,
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  if (!strategies.length) {
    return (
      <Card className="py-16">
        <CardContent className="text-center">
          <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">Aucune stratégie analysable sur cette période.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analyse Stratégique</h2>
          <p className="text-sm text-muted-foreground">{strategies.length} stratégies · {trades.length} trades</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Dernier mois</SelectItem>
            <SelectItem value="quarter">Dernier trimestre</SelectItem>
            <SelectItem value="year">Dernière année</SelectItem>
            <SelectItem value="all">Toutes les données</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Strategy cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {strategies.map((s, idx) => (
          <Card key={s.name} className={cn(
            'overflow-hidden border bg-gradient-to-br from-card to-card/50 transition-all hover:shadow-lg hover:-translate-y-0.5',
            idx === 0 && 'border-primary/40'
          )}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {idx === 0 && <Trophy className="h-4 w-4 text-amber-500" />}
                    {idx > 0 && <Zap className="h-4 w-4 text-primary" />}
                    {s.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.metrics.tradeCount} trades</p>
                </div>
                <Badge variant={s.metrics.totalReturn >= 0 ? 'default' : 'destructive'} className="font-mono">
                  {s.metrics.totalReturn >= 0 ? '+' : ''}{fmtCur(s.metrics.totalReturn, ccy)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Metric label="Win Rate" value={fmtPct(s.metrics.winRate)} tone={s.metrics.winRate >= 50 ? 'profit' : 'neutral'} />
                <Metric label="PF" value={fmtNum(s.metrics.profitFactor)} tone={s.metrics.profitFactor >= 1.5 ? 'profit' : 'neutral'} />
                <Metric label="Sharpe" value={fmtNum(s.metrics.sharpeRatio)} tone={s.metrics.sharpeRatio >= 1 ? 'profit' : 'neutral'} />
                <Metric label="Max DD" value={fmtPct(s.metrics.maxDrawdownPct)} tone="loss" />
                <Metric label="Expectancy" value={fmtCur(s.metrics.expectancy, ccy)} tone={s.metrics.expectancy >= 0 ? 'profit' : 'loss'} />
                <Metric label="RR moy." value={fmtNum(s.metrics.payoffRatio)} />
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Stabilité</span><span>{s.stability.toFixed(0)}/100</span>
                </div>
                <Progress value={s.stability} className="h-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.avgDurationDays.toFixed(1)} j/trade</span>
                <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> Vol {fmtPct(s.metrics.volatility)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          <TabsTrigger value="behavior">Comportement</TabsTrigger>
          <TabsTrigger value="quant">Quantitatif</TabsTrigger>
          <TabsTrigger value="risk">Risques</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Tableau comparatif & classement</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Stratégie</TableHead>
                    <TableHead className="text-right">PnL</TableHead>
                    <TableHead className="text-right">Trades</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                    <TableHead className="text-right">PF</TableHead>
                    <TableHead className="text-right">Sharpe</TableHead>
                    <TableHead className="text-right">Sortino</TableHead>
                    <TableHead className="text-right">Max DD</TableHead>
                    <TableHead className="text-right">Expectancy</TableHead>
                    <TableHead className="text-right">Stabilité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {strategies.map((s, i) => (
                    <TableRow key={s.name} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-xs">
                        {i === 0 ? <Trophy className="h-4 w-4 text-amber-500" /> : `#${i + 1}`}
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className={cn('text-right font-mono', s.metrics.totalReturn >= 0 ? 'text-profit' : 'text-loss')}>
                        {fmtCur(s.metrics.totalReturn, ccy)}
                      </TableCell>
                      <TableCell className="text-right">{s.metrics.tradeCount}</TableCell>
                      <TableCell className="text-right">{fmtPct(s.metrics.winRate)}</TableCell>
                      <TableCell className="text-right">{fmtNum(s.metrics.profitFactor)}</TableCell>
                      <TableCell className="text-right">{fmtNum(s.metrics.sharpeRatio)}</TableCell>
                      <TableCell className="text-right">{fmtNum(s.metrics.sortinoRatio)}</TableCell>
                      <TableCell className="text-right text-loss">{fmtPct(s.metrics.maxDrawdownPct)}</TableCell>
                      <TableCell className={cn('text-right', s.metrics.expectancy >= 0 ? 'text-profit' : 'text-loss')}>
                        {fmtCur(s.metrics.expectancy, ccy)}
                      </TableCell>
                      <TableCell className="text-right">{s.stability.toFixed(0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Courbes d'equity comparées</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={compareSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="idx" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtCur(v, ccy)} width={70} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => fmtCur(Number(v), ccy)} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                    {strategies.slice(0, 6).map((s, i) => (
                      <Line key={s.name} type="monotone" dataKey={s.name} stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                        strokeWidth={2} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Radar multi-métriques</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fontSize: 9 }} angle={90} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                    {strategies.slice(0, 5).map((s, i) => (
                      <Radar key={s.name} name={s.name} dataKey={s.name}
                        stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                        fill={SERIES_COLORS[i % SERIES_COLORS.length]} fillOpacity={0.15} />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Heures les plus rentables</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={behavior.topHours.slice(0, 12)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtCur(v, ccy)} width={70} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => fmtCur(Number(v), ccy)} />
                    <ReferenceLine y={0} stroke="hsl(var(--border))" />
                    <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                      {behavior.topHours.slice(0, 12).map((d, i) => (
                        <Cell key={i} fill={d.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> Meilleurs jours</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={behavior.topDays}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtCur(v, ccy)} width={70} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => fmtCur(Number(v), ccy)} />
                    <ReferenceLine y={0} stroke="hsl(var(--border))" />
                    <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                      {behavior.topDays.map((d, i) => (
                        <Cell key={i} fill={d.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4" /> Actifs les plus rentables</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Actif</TableHead>
                    <TableHead className="text-right">Trades</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                    <TableHead className="text-right">PnL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {behavior.topAssets.map(a => (
                    <TableRow key={a.name}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell className="text-right">{a.count}</TableCell>
                      <TableCell className="text-right">{fmtPct(a.winRate)}</TableCell>
                      <TableCell className={cn('text-right font-mono', a.pnl >= 0 ? 'text-profit' : 'text-loss')}>
                        {fmtCur(a.pnl, ccy)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quant" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Analyse quantitative détaillée</CardTitle>
              <p className="text-xs text-muted-foreground">Métriques avancées par stratégie</p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stratégie</TableHead>
                    <TableHead className="text-right">Expectancy</TableHead>
                    <TableHead className="text-right">Avg Win</TableHead>
                    <TableHead className="text-right">Avg Loss</TableHead>
                    <TableHead className="text-right">RR</TableHead>
                    <TableHead className="text-right">Volatilité</TableHead>
                    <TableHead className="text-right">Calmar</TableHead>
                    <TableHead className="text-right">Recovery</TableHead>
                    <TableHead className="text-right">VaR 95%</TableHead>
                    <TableHead className="text-right">CVaR 95%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {strategies.map(s => (
                    <TableRow key={s.name}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className={cn('text-right', s.metrics.expectancy >= 0 ? 'text-profit' : 'text-loss')}>
                        {fmtCur(s.metrics.expectancy, ccy)}
                      </TableCell>
                      <TableCell className="text-right text-profit">{fmtCur(s.metrics.avgWin, ccy)}</TableCell>
                      <TableCell className="text-right text-loss">{fmtCur(-s.metrics.avgLoss, ccy)}</TableCell>
                      <TableCell className="text-right">{fmtNum(s.metrics.payoffRatio)}</TableCell>
                      <TableCell className="text-right">{fmtPct(s.metrics.volatility)}</TableCell>
                      <TableCell className="text-right">{fmtNum(s.metrics.calmarRatio)}</TableCell>
                      <TableCell className="text-right">{fmtNum(s.metrics.recoveryFactor)}</TableCell>
                      <TableCell className="text-right text-loss">{fmtCur(s.metrics.valueAtRisk95, ccy)}</TableCell>
                      <TableCell className="text-right text-loss">{fmtCur(s.metrics.conditionalVaR95, ccy)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Détection de patterns à risque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lossPatterns.map(p => (
                  <div key={p.name} className="border border-border rounded-lg p-3 bg-card/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{p.name}</span>
                      <Badge variant={p.risk === 'Faible' ? 'default' : p.risk === 'Modéré' ? 'secondary' : 'destructive'}>
                        Risque {p.risk}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Pertes consécutives</p>
                        <p className="font-mono font-semibold">{p.consecutiveLosses}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Taux de perte</p>
                        <p className="font-mono font-semibold">{fmtPct(p.lossRate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Perte moyenne</p>
                        <p className="font-mono font-semibold text-loss">{fmtCur(-p.avgLoss, ccy)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-profit" /> Efficacité du risk management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stratégie</TableHead>
                    <TableHead className="text-right">Profit Factor</TableHead>
                    <TableHead className="text-right">Risk of Ruin</TableHead>
                    <TableHead className="text-right">Max Streak Pertes</TableHead>
                    <TableHead className="text-right">Verdict</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {strategies.map(s => {
                    const score = s.metrics.profitFactor >= 1.5 && s.metrics.riskOfRuin < 5;
                    return (
                      <TableRow key={s.name}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-right">{fmtNum(s.metrics.profitFactor)}</TableCell>
                        <TableCell className="text-right">{fmtPct(s.metrics.riskOfRuin)}</TableCell>
                        <TableCell className="text-right">{s.metrics.consecutiveLosses}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={score ? 'default' : 'secondary'}>
                            {score ? 'Sain' : 'À surveiller'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'profit' | 'loss' | 'neutral' }) {
  return (
    <div className="bg-muted/40 rounded p-2">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={cn('font-mono font-semibold text-sm',
        tone === 'profit' ? 'text-profit' : tone === 'loss' ? 'text-loss' : 'text-foreground')}>
        {value}
      </p>
    </div>
  );
}
