import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { performanceHeatmap, performanceBySession } from '@/utils/quantStats';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from 'recharts';

interface PerformancePatternsProps { trades: any[] }

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export function PerformancePatterns({ trades }: PerformancePatternsProps) {
  const heatmap = useMemo(() => performanceHeatmap(trades), [trades]);
  const sessions = useMemo(() => performanceBySession(trades), [trades]);

  const maxAbs = useMemo(() => {
    const v = Math.max(...heatmap.map(c => Math.abs(c.pnl)), 1);
    return v;
  }, [heatmap]);

  const colorFor = (pnl: number) => {
    if (pnl === 0) return 'hsl(var(--muted))';
    const intensity = Math.min(1, Math.abs(pnl) / maxAbs);
    if (pnl > 0) return `hsl(142 76% 45% / ${0.15 + intensity * 0.85})`;
    return `hsl(0 84% 55% / ${0.15 + intensity * 0.85})`;
  };

  const dayPerf = useMemo(() => {
    const out = DAYS.map((d, i) => ({ day: d, pnl: 0, count: 0 }));
    for (const c of heatmap) { out[c.day].pnl += c.pnl; out[c.day].count += c.count; }
    return out;
  }, [heatmap]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Heatmap de performance — Jour × Heure</CardTitle>
          <p className="text-sm text-muted-foreground">PnL agrégé par créneau horaire</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid" style={{ gridTemplateColumns: 'auto repeat(24, minmax(28px, 1fr))', gap: 2 }}>
              <div />
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="text-[10px] text-center text-muted-foreground">{h}h</div>
              ))}
              {DAYS.map((day, dIdx) => (
                <>
                  <div key={`d-${dIdx}`} className="text-xs text-muted-foreground pr-2 flex items-center">{day}</div>
                  {Array.from({ length: 24 }).map((_, h) => {
                    const cell = heatmap.find(c => c.day === dIdx && c.hour === h)!;
                    return (
                      <div
                        key={`${dIdx}-${h}`}
                        title={`${day} ${h}h — ${cell.pnl.toFixed(0)}€ (${cell.count} trades)`}
                        className="aspect-square rounded-sm border border-border/30"
                        style={{ background: colorFor(cell.pnl) }}
                      />
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Performance par session</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sessions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="session" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="pnl" fill="hsl(var(--primary))" name="PnL" radius={[3, 3, 0, 0]} />
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
    </div>
  );
}
