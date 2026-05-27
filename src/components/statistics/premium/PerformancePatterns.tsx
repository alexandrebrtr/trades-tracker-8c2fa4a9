import { Fragment, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { performanceHeatmap } from '@/utils/quantStats';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import { AlertTriangle, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';

interface Props { trades: any[] }

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

/** Sessions FX classiques en heures UTC, avec overlap. */
const sessionForHour = (h: number): string[] => {
  const out: string[] = [];
  if (h >= 0 && h < 9) out.push('Asie');
  if (h >= 7 && h < 16) out.push('Londres');
  if (h >= 13 && h < 22) out.push('New York');
  if (h >= 13 && h < 16) out.push('Overlap LDN/NY');
  if (h >= 7 && h < 9) out.push('Overlap ASIE/LDN');
  return out;
};

export function PerformancePatterns({ trades }: Props) {
  const heatmap = useMemo(() => performanceHeatmap(trades), [trades]);

  const maxAbs = useMemo(() => Math.max(...heatmap.map(c => Math.abs(c.pnl)), 1), [heatmap]);
  const colorFor = (pnl: number) => {
    if (pnl === 0) return 'hsl(var(--muted))';
    const intensity = Math.min(1, Math.abs(pnl) / maxAbs);
    if (pnl > 0) return `hsl(142 76% 45% / ${0.15 + intensity * 0.85})`;
    return `hsl(0 84% 55% / ${0.15 + intensity * 0.85})`;
  };

  const dayPerf = useMemo(() => {
    const out = DAYS.map((d) => ({ day: d, pnl: 0, count: 0 }));
    for (const c of heatmap) { out[c.day].pnl += c.pnl; out[c.day].count += c.count; }
    return out;
  }, [heatmap]);

  const monthPerf = useMemo(() => {
    const out = MONTHS.map(m => ({ month: m, pnl: 0, count: 0 }));
    for (const t of trades) {
      if (!t.date) continue;
      const m = new Date(t.date).getMonth();
      out[m].pnl += Number(t.pnl) || 0;
      out[m].count += 1;
    }
    return out;
  }, [trades]);

  const hourPerf = useMemo(() => {
    const out = Array.from({ length: 24 }, (_, h) => ({ hour: `${h}h`, pnl: 0, count: 0 }));
    for (const c of heatmap) { out[c.hour].pnl += c.pnl; out[c.hour].count += c.count; }
    return out;
  }, [heatmap]);

  const sessionsAgg = useMemo(() => {
    const map: Record<string, { pnl: number; count: number; wins: number }> = {};
    for (const t of trades) {
      if (!t.date) continue;
      const h = new Date(t.date).getUTCHours();
      const pnl = Number(t.pnl) || 0;
      for (const s of sessionForHour(h)) {
        const cur = (map[s] ||= { pnl: 0, count: 0, wins: 0 });
        cur.pnl += pnl;
        cur.count += 1;
        if (pnl > 0) cur.wins += 1;
      }
    }
    return Object.entries(map).map(([session, v]) => ({
      session, pnl: v.pnl, count: v.count,
      winRate: v.count ? (v.wins / v.count) * 100 : 0,
    }));
  }, [trades]);

  const assetPerf = useMemo(() => {
    const map: Record<string, { pnl: number; count: number; wins: number }> = {};
    for (const t of trades) {
      const a = t.asset_class || 'autres';
      const cur = (map[a] ||= { pnl: 0, count: 0, wins: 0 });
      const pnl = Number(t.pnl) || 0;
      cur.pnl += pnl; cur.count += 1;
      if (pnl > 0) cur.wins += 1;
    }
    return Object.entries(map).map(([asset, v]) => ({
      asset, pnl: v.pnl, count: v.count,
      winRate: v.count ? (v.wins / v.count) * 100 : 0,
    })).sort((a, b) => b.pnl - a.pnl);
  }, [trades]);

  // Streak detection
  const streaks = useMemo(() => {
    const sorted = [...trades]
      .filter(t => t.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let maxWin = 0, maxLoss = 0, curW = 0, curL = 0;
    const sequences: { type: 'win' | 'loss'; len: number; pnl: number }[] = [];
    let curSeq: { type: 'win' | 'loss' | null; len: number; pnl: number } = { type: null, len: 0, pnl: 0 };
    for (const t of sorted) {
      const p = Number(t.pnl) || 0;
      if (p > 0) {
        curW++; if (curW > maxWin) maxWin = curW; curL = 0;
        if (curSeq.type === 'win') { curSeq.len++; curSeq.pnl += p; }
        else { if (curSeq.type) sequences.push(curSeq as any); curSeq = { type: 'win', len: 1, pnl: p }; }
      } else if (p < 0) {
        curL++; if (curL > maxLoss) maxLoss = curL; curW = 0;
        if (curSeq.type === 'loss') { curSeq.len++; curSeq.pnl += p; }
        else { if (curSeq.type) sequences.push(curSeq as any); curSeq = { type: 'loss', len: 1, pnl: p }; }
      }
    }
    if (curSeq.type) sequences.push(curSeq as any);
    return { maxWin, maxLoss, sequences };
  }, [trades]);

  // Pattern detection — heuristics
  const patterns = useMemo(() => {
    const detected: { kind: 'good' | 'bad' | 'warn'; title: string; detail: string }[] = [];
    // Best hour
    const sortedHours = [...hourPerf].filter(h => h.count > 2).sort((a, b) => b.pnl - a.pnl);
    if (sortedHours[0]?.pnl > 0) {
      detected.push({ kind: 'good', title: `Heure la plus rentable: ${sortedHours[0].hour}`,
        detail: `${sortedHours[0].count} trades, PnL ${sortedHours[0].pnl.toFixed(0)}` });
    }
    if (sortedHours.length && sortedHours[sortedHours.length - 1].pnl < 0) {
      const worst = sortedHours[sortedHours.length - 1];
      detected.push({ kind: 'bad', title: `Heure la plus perdante: ${worst.hour}`,
        detail: `${worst.count} trades, PnL ${worst.pnl.toFixed(0)}` });
    }
    // Best day
    const sortedDays = [...dayPerf].filter(d => d.count > 2).sort((a, b) => b.pnl - a.pnl);
    if (sortedDays[0]?.pnl > 0) {
      detected.push({ kind: 'good', title: `Jour le plus performant: ${sortedDays[0].day}`,
        detail: `${sortedDays[0].count} trades, PnL ${sortedDays[0].pnl.toFixed(0)}` });
    }
    // Long losing streak
    if (streaks.maxLoss >= 4) {
      detected.push({ kind: 'warn', title: `Série perdante détectée: ${streaks.maxLoss} trades consécutifs`,
        detail: 'Risque de comportement émotionnel — revoir la discipline d\'exécution.' });
    }
    // Revenge trading: many trades within short window after a loss
    const sortedT = [...trades].filter(t => t.date).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime());
    let revenge = 0;
    for (let i = 1; i < sortedT.length; i++) {
      const prev = Number(sortedT[i - 1].pnl) || 0;
      if (prev >= 0) continue;
      const dt = new Date(sortedT[i].date).getTime() - new Date(sortedT[i - 1].date).getTime();
      if (dt < 15 * 60 * 1000) revenge++;
    }
    if (revenge >= 3) {
      detected.push({ kind: 'warn', title: `Revenge trading suspecté (${revenge} occurences)`,
        detail: 'Trades ouverts < 15 min après une perte.' });
    }
    // Session bias
    if (sessionsAgg.length) {
      const best = [...sessionsAgg].sort((a, b) => b.pnl - a.pnl)[0];
      if (best.pnl > 0) detected.push({ kind: 'good', title: `Meilleure session: ${best.session}`,
        detail: `Win rate ${best.winRate.toFixed(0)}% sur ${best.count} trades` });
    }
    return detected;
  }, [hourPerf, dayPerf, streaks, trades, sessionsAgg]);

  const radarSessions = useMemo(() =>
    sessionsAgg.map(s => ({ session: s.session, winRate: s.winRate, pnl: Math.max(0, s.pnl) })),
  [sessionsAgg]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Heatmap de performance — Jour × Heure</CardTitle>
          <p className="text-sm text-muted-foreground">PnL agrégé par créneau (toutes dates confondues)</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid" style={{ gridTemplateColumns: 'auto repeat(24, minmax(28px, 1fr))', gap: 2 }}>
              <div />
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="text-[10px] text-center text-muted-foreground">{h}h</div>
              ))}
              {DAYS.map((day, dIdx) => (
                <Fragment key={dIdx}>
                  <div className="text-xs text-muted-foreground pr-2 flex items-center">{day}</div>
                  {Array.from({ length: 24 }).map((_, h) => {
                    const cell = heatmap.find(c => c.day === dIdx && c.hour === h)!;
                    return (
                      <div key={`${dIdx}-${h}`}
                        title={`${day} ${h}h — ${cell.pnl.toFixed(0)} (${cell.count} trades)`}
                        className="aspect-square rounded-sm border border-border/30"
                        style={{ background: colorFor(cell.pnl) }} />
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Performance par session (overlap inclus)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sessionsAgg}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="session" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="pnl" name="PnL" radius={[3, 3, 0, 0]}>
                  {sessionsAgg.map((s, i) => (
                    <Cell key={i} fill={s.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Radar — winRate vs PnL par session</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarSessions}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="session" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} />
                <Radar dataKey="winRate" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.3)" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Performance par heure</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={hourPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {hourPerf.map((d, i) => (
                    <Cell key={i} fill={d.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Performance par jour de semaine</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dayPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {dayPerf.map((d, i) => (
                    <Cell key={i} fill={d.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Performance par mois</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {monthPerf.map((d, i) => (
                    <Cell key={i} fill={d.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Performance par classe d'actif</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={assetPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="asset" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {assetPerf.map((d, i) => (
                    <Cell key={i} fill={d.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détection de patterns & comportements</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-profit border-profit/40">
              Série gagnante max: {streaks.maxWin}
            </Badge>
            <Badge variant="outline" className="text-loss border-loss/40">
              Série perdante max: {streaks.maxLoss}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {patterns.length === 0 ? (
            <p className="text-sm text-muted-foreground">Pas assez de données pour détecter des patterns significatifs.</p>
          ) : (
            <div className="space-y-2">
              {patterns.map((p, i) => {
                const Icon = p.kind === 'good' ? CheckCircle2 : p.kind === 'bad' ? TrendingDown : AlertTriangle;
                const color = p.kind === 'good' ? 'text-profit' : p.kind === 'bad' ? 'text-loss' : 'text-warning';
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50">
                    <Icon className={`h-4 w-4 mt-0.5 ${color}`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
