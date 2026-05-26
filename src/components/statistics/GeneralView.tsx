import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccount } from '@/context/AccountContext';
import { subDays, subMonths, format, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  computeQuantMetrics, equityCurve, drawdownSeries, returnDistribution,
  performanceHeatmap, performanceBySession,
} from '@/utils/quantStats';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine, PieChart, Pie, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Activity, Target, Award, AlertTriangle,
  Zap, BarChart3, Percent, Clock, Flame, ShieldAlert, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PERIODS = [
  { value: '7d', label: '7 jours', days: 7 },
  { value: '1m', label: '1 mois', days: 30 },
  { value: '3m', label: '3 mois', days: 90 },
  { value: '6m', label: '6 mois', days: 180 },
  { value: '1y', label: '1 an', days: 365 },
  { value: 'all', label: 'Tout', days: null as number | null },
];

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const fmtCur = (v: number, ccy = 'EUR') =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: ccy, maximumFractionDigits: 0 }).format(v || 0);
const fmtPct = (v: number, digits = 2) => `${(v ?? 0).toFixed(digits)}%`;
const fmtNum = (v: number, digits = 2) => (v ?? 0).toFixed(digits);

interface KpiProps {
  title: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: React.ReactNode;
  tone?: 'profit' | 'loss' | 'neutral' | 'primary';
  hint?: string;
}
function KpiCard({ title, value, delta, deltaLabel, icon, tone = 'neutral', hint }: KpiProps) {
  const toneRing = {
    profit: 'from-profit/20 to-transparent border-profit/30',
    loss: 'from-loss/20 to-transparent border-loss/30',
    primary: 'from-primary/20 to-transparent border-primary/30',
    neutral: 'from-muted/40 to-transparent border-border',
  }[tone];
  return (
    <Card className={cn('relative overflow-hidden border bg-gradient-to-br backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-0.5 animate-fade-in', toneRing)}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{title}</span>
          <span className="text-muted-foreground/70">{icon}</span>
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(delta !== undefined || hint) && (
          <div className="flex items-center justify-between mt-2 text-xs">
            {delta !== undefined ? (
              <span className={cn('inline-flex items-center gap-1 font-medium',
                delta > 0 ? 'text-profit' : delta < 0 ? 'text-loss' : 'text-muted-foreground')}>
                {delta > 0 ? <ArrowUpRight className="h-3 w-3" /> : delta < 0 ? <ArrowDownRight className="h-3 w-3" /> : null}
                {fmtPct(Math.abs(delta))} {deltaLabel}
              </span>
            ) : <span />}
            {hint && <span className="text-muted-foreground/70">{hint}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function GeneralView({ trades }: { trades: any[] }) {
  const { activeAccount } = useAccount();
  const ccy = activeAccount?.currency || 'EUR';
  const initialCapital = activeAccount?.initial_capital || 10000;
  const [period, setPeriod] = useState('3m');

  const { current, previous } = useMemo(() => {
    const sorted = [...(trades || [])].filter(t => Number.isFinite(Number(t.pnl)))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const cfg = PERIODS.find(p => p.value === period)!;
    if (!cfg.days) return { current: sorted, previous: [] as any[] };
    const now = Date.now();
    const startMs = subDays(now, cfg.days).getTime();
    const prevStart = subDays(now, cfg.days * 2).getTime();
    return {
      current: sorted.filter(t => new Date(t.date).getTime() >= startMs),
      previous: sorted.filter(t => {
        const ts = new Date(t.date).getTime();
        return ts >= prevStart && ts < startMs;
      }),
    };
  }, [trades, period]);

  const m = useMemo(() => computeQuantMetrics(current, initialCapital), [current, initialCapital]);
  const mPrev = useMemo(() => computeQuantMetrics(previous, initialCapital), [previous, initialCapital]);

  const pnls = useMemo(() => current.map(t => Number(t.pnl) || 0), [current]);
  const equity = useMemo(() => equityCurve(pnls, initialCapital), [pnls, initialCapital]);
  const dd = useMemo(() => drawdownSeries(equity), [equity]);

  const equityData = useMemo(() => {
    return current.map((t, i) => ({
      date: format(new Date(t.date), 'dd MMM', { locale: fr }),
      equity: equity[i + 1],
      drawdown: dd[i + 1]?.drawdownPct ?? 0,
    }));
  }, [current, equity, dd]);

  const distribution = useMemo(() => returnDistribution(pnls, 18), [pnls]);
  const heatmap = useMemo(() => performanceHeatmap(current), [current]);
  const sessions = useMemo(() => performanceBySession(current), [current]);

  const byWeekday = useMemo(() => {
    const out = DAYS_FR.map((d, i) => ({ day: d, pnl: 0, count: 0 }));
    for (const t of current) {
      const w = new Date(t.date).getDay();
      out[w].pnl += Number(t.pnl) || 0;
      out[w].count += 1;
    }
    return out;
  }, [current]);

  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of current) {
      const k = format(startOfMonth(new Date(t.date)), 'MMM yy', { locale: fr });
      map.set(k, (map.get(k) || 0) + (Number(t.pnl) || 0));
    }
    return Array.from(map, ([month, pnl]) => ({ month, pnl }));
  }, [current]);

  const byAsset = useMemo(() => {
    const map = new Map<string, { pnl: number; count: number }>();
    for (const t of current) {
      const k = t.symbol || t.asset_class || 'N/A';
      const cur = map.get(k) || { pnl: 0, count: 0 };
      cur.pnl += Number(t.pnl) || 0; cur.count += 1;
      map.set(k, cur);
    }
    return Array.from(map, ([name, v]) => ({ name, pnl: v.pnl, count: v.count }))
      .sort((a, b) => b.pnl - a.pnl).slice(0, 10);
  }, [current]);

  const byStrategy = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of current) {
      const k = t.strategy || 'Non définie';
      map.set(k, (map.get(k) || 0) + (Number(t.pnl) || 0));
    }
    return Array.from(map, ([name, pnl]) => ({ name, pnl }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [current]);

  const heatMax = useMemo(() => Math.max(...heatmap.map(c => Math.abs(c.pnl)), 1), [heatmap]);
  const heatColor = (pnl: number) => {
    if (!pnl) return 'hsl(var(--muted) / 0.4)';
    const i = Math.min(1, Math.abs(pnl) / heatMax);
    return pnl > 0
      ? `hsl(var(--profit) / ${0.15 + i * 0.85})`
      : `hsl(var(--loss) / ${0.15 + i * 0.85})`;
  };

  const deltaPct = (cur: number, prev: number) => {
    if (!prev) return cur ? 100 : 0;
    return ((cur - prev) / Math.abs(prev)) * 100;
  };

  const tooltipStyle = {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 8,
    fontSize: 12,
  };

  if (!current.length) {
    return (
      <Card className="py-16">
        <CardContent className="text-center">
          <Activity className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">Aucun trade sur cette période.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Overview</h2>
          <p className="text-sm text-muted-foreground">
            {m.tradeCount} trades · Capital initial {fmtCur(initialCapital, ccy)}
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PERIODS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* KPI rows */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard title="PnL Total" value={fmtCur(m.totalReturn, ccy)}
          delta={deltaPct(m.totalReturn, mPrev.totalReturn)} deltaLabel="vs précédent"
          icon={<TrendingUp className="h-4 w-4" />} tone={m.totalReturn >= 0 ? 'profit' : 'loss'} />
        <KpiCard title="Rendement" value={fmtPct(m.totalReturnPct)}
          delta={deltaPct(m.totalReturnPct, mPrev.totalReturnPct)} deltaLabel="vs précédent"
          icon={<Percent className="h-4 w-4" />} tone={m.totalReturnPct >= 0 ? 'profit' : 'loss'} />
        <KpiCard title="Win Rate" value={fmtPct(m.winRate, 1)}
          icon={<Target className="h-4 w-4" />} tone={m.winRate >= 50 ? 'profit' : 'neutral'}
          hint={`${current.filter(t => (t.pnl || 0) > 0).length}/${m.tradeCount}`} />
        <KpiCard title="Profit Factor" value={fmtNum(m.profitFactor)}
          icon={<Zap className="h-4 w-4" />} tone={m.profitFactor >= 1.5 ? 'profit' : m.profitFactor >= 1 ? 'neutral' : 'loss'} />
        <KpiCard title="Expectancy" value={fmtCur(m.expectancy, ccy)}
          icon={<Activity className="h-4 w-4" />} tone={m.expectancy >= 0 ? 'profit' : 'loss'} hint="/ trade" />
        <KpiCard title="Average RR" value={fmtNum(m.payoffRatio)}
          icon={<BarChart3 className="h-4 w-4" />} tone={m.payoffRatio >= 1 ? 'profit' : 'neutral'} />

        <KpiCard title="Sharpe Ratio" value={fmtNum(m.sharpeRatio)}
          icon={<Award className="h-4 w-4" />} tone={m.sharpeRatio >= 1 ? 'profit' : 'neutral'} hint="ann." />
        <KpiCard title="Sortino Ratio" value={fmtNum(m.sortinoRatio)}
          icon={<Award className="h-4 w-4" />} tone={m.sortinoRatio >= 1 ? 'profit' : 'neutral'} hint="ann." />
        <KpiCard title="Calmar Ratio" value={fmtNum(m.calmarRatio)}
          icon={<Award className="h-4 w-4" />} tone={m.calmarRatio >= 1 ? 'profit' : 'neutral'} />
        <KpiCard title="Recovery Factor" value={fmtNum(m.recoveryFactor)}
          icon={<Flame className="h-4 w-4" />} tone={m.recoveryFactor >= 2 ? 'profit' : 'neutral'} />
        <KpiCard title="Max Drawdown" value={fmtPct(m.maxDrawdownPct)}
          icon={<TrendingDown className="h-4 w-4" />} tone="loss" hint={fmtCur(m.maxDrawdown, ccy)} />
        <KpiCard title="Avg Drawdown" value={fmtPct(m.avgDrawdownPct)}
          icon={<ShieldAlert className="h-4 w-4" />} tone="neutral" hint={fmtCur(m.avgDrawdown, ccy)} />

        <KpiCard title="Volatilité" value={fmtPct(m.volatility)}
          icon={<Activity className="h-4 w-4" />} hint="annualisée" />
        <KpiCard title="Avg Win" value={fmtCur(m.avgWin, ccy)}
          icon={<TrendingUp className="h-4 w-4" />} tone="profit" />
        <KpiCard title="Avg Loss" value={fmtCur(-m.avgLoss, ccy)}
          icon={<TrendingDown className="h-4 w-4" />} tone="loss" />
        <KpiCard title="Largest Win" value={fmtCur(m.bestTrade, ccy)}
          icon={<ArrowUpRight className="h-4 w-4" />} tone="profit" />
        <KpiCard title="Largest Loss" value={fmtCur(m.worstTrade, ccy)}
          icon={<ArrowDownRight className="h-4 w-4" />} tone="loss" />
        <KpiCard title="Streak G / P" value={`${m.consecutiveWins} / ${m.consecutiveLosses}`}
          icon={<Flame className="h-4 w-4" />} hint="max consécutifs" />
      </div>

      {/* Equity & Drawdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Equity Curve</CardTitle>
              <p className="text-xs text-muted-foreground">Évolution du capital</p>
            </div>
            <Badge variant={m.totalReturn >= 0 ? 'default' : 'destructive'}>
              {m.totalReturn >= 0 ? '+' : ''}{fmtCur(m.totalReturn, ccy)}
            </Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={30} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtCur(v, ccy)} width={70} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => fmtCur(Number(v), ccy)} />
                <ReferenceLine y={initialCapital} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 4" />
                <Area type="monotone" dataKey="equity" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#eq)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Drawdown</CardTitle>
            <p className="text-xs text-muted-foreground">Recul depuis le sommet (%)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="dd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--loss))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--loss))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={30} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v.toFixed(0)}%`} width={45} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${Number(v).toFixed(2)}%`} />
                <Area type="monotone" dataKey="drawdown" stroke="hsl(var(--loss))" strokeWidth={2} fill="url(#dd)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution & Monthly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Histogramme des rendements</CardTitle>
            <p className="text-xs text-muted-foreground">Distribution des PnL par trade</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="bucket" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {distribution.map((d, i) => (
                    <Cell key={i} fill={d.value >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performance mensuelle</CardTitle>
            <p className="text-xs text-muted-foreground">PnL agrégé par mois</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmtCur(v, ccy)} width={70} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => fmtCur(Number(v), ccy)} />
                <ReferenceLine y={0} stroke="hsl(var(--border))" />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {monthly.map((d, i) => (
                    <Cell key={i} fill={d.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Heatmap — Jour × Heure</CardTitle>
          <p className="text-xs text-muted-foreground">PnL agrégé par créneau horaire</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid" style={{ gridTemplateColumns: 'auto repeat(24, minmax(22px,1fr))', gap: 2, minWidth: 600 }}>
              <div />
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="text-[9px] text-center text-muted-foreground">{h}</div>
              ))}
              {DAYS_FR.map((day, dIdx) => (
                <div key={dIdx} style={{ display: 'contents' }}>
                  <div className="text-[10px] text-muted-foreground pr-2 flex items-center">{day}</div>
                  {Array.from({ length: 24 }).map((_, h) => {
                    const c = heatmap.find(x => x.day === dIdx && x.hour === h)!;
                    return (
                      <div key={h} title={`${day} ${h}h — ${fmtCur(c.pnl, ccy)} (${c.count})`}
                        className="aspect-square rounded-sm transition-transform hover:scale-110 cursor-pointer"
                        style={{ background: heatColor(c.pnl) }} />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions / Weekday / Win-loss pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Par session</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sessions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="session" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => fmtCur(Number(v), ccy)} />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {sessions.map((s, i) => (
                    <Cell key={i} fill={s.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Par jour de semaine</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byWeekday}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => fmtCur(Number(v), ccy)} />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {byWeekday.map((d, i) => (
                    <Cell key={i} fill={d.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Gagnants vs Perdants</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={[
                  { name: 'Gagnants', value: current.filter(t => (t.pnl || 0) > 0).length },
                  { name: 'Perdants', value: current.filter(t => (t.pnl || 0) < 0).length },
                ]} innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  <Cell fill="hsl(var(--profit))" />
                  <Cell fill="hsl(var(--loss))" />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* By asset / strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top actifs (par PnL)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(220, byAsset.length * 28)}>
              <BarChart data={byAsset} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => fmtCur(v, ccy)} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => fmtCur(Number(v), ccy)} />
                <Bar dataKey="pnl" radius={[0, 3, 3, 0]}>
                  {byAsset.map((d, i) => (
                    <Cell key={i} fill={d.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Par stratégie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(220, byStrategy.length * 32)}>
              <BarChart data={byStrategy} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => fmtCur(v, ccy)} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => fmtCur(Number(v), ccy)} />
                <Bar dataKey="pnl" radius={[0, 3, 3, 0]}>
                  {byStrategy.map((d, i) => (
                    <Cell key={i} fill={d.pnl >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
