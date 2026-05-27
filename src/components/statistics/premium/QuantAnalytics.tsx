import { useMemo, Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataCard } from '@/components/ui/data-card';
import { useAccount } from '@/context/AccountContext';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  ScatterChart, Scatter, ZAxis, AreaChart, Area, ReferenceLine,
} from 'recharts';
import { Activity, BarChart3, Sigma, Waves } from 'lucide-react';
import { equityCurve, mean, stdDev, drawdownSeries } from '@/utils/quantStats';

interface Props { trades: any[]; initialCapital: number }

const TRADING_DAYS = 252;

const rolling = <T,>(arr: T[], win: number, fn: (slice: T[]) => number) => {
  const out: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (i < win - 1) { out.push(NaN); continue; }
    out.push(fn(arr.slice(i - win + 1, i + 1)));
  }
  return out;
};

const correlation = (a: number[], b: number[]) => {
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const ma = mean(a.slice(0, n));
  const mb = mean(b.slice(0, n));
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  if (da === 0 || db === 0) return 0;
  return num / Math.sqrt(da * db);
};

export function QuantAnalytics({ trades, initialCapital }: Props) {
  const { activeAccount } = useAccount();
  const currency = activeAccount?.currency || 'EUR';
  const fmt = useMemo(() =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }),
  [currency]);

  const sorted = useMemo(() =>
    [...trades]
      .filter(t => Number.isFinite(Number(t.pnl)))
      .sort((a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()),
  [trades]);

  const pnls = useMemo(() => sorted.map(t => Number(t.pnl) || 0), [sorted]);
  const cap = initialCapital > 0 ? initialCapital : 10000;
  const returns = useMemo(() => pnls.map(p => p / cap), [pnls, cap]);
  const equity = useMemo(() => equityCurve(pnls, cap), [pnls, cap]);
  const dd = useMemo(() => drawdownSeries(equity), [equity]);

  // Rolling metrics
  const ROLL = Math.min(30, Math.max(5, Math.floor(returns.length / 4)));
  const rollVol = useMemo(() =>
    rolling(returns, ROLL, s => stdDev(s) * Math.sqrt(TRADING_DAYS) * 100),
  [returns, ROLL]);
  const rollMean = useMemo(() =>
    rolling(returns, ROLL, s => mean(s) * TRADING_DAYS * 100),
  [returns, ROLL]);
  const rollSharpe = useMemo(() =>
    rolling(returns, ROLL, s => {
      const sd = stdDev(s);
      return sd === 0 ? 0 : (mean(s) / sd) * Math.sqrt(TRADING_DAYS);
    }),
  [returns, ROLL]);

  const rollingSeries = useMemo(() =>
    rollVol.map((v, i) => ({
      i, vol: Number.isFinite(v) ? v : null,
      mean: Number.isFinite(rollMean[i]) ? rollMean[i] : null,
      sharpe: Number.isFinite(rollSharpe[i]) ? rollSharpe[i] : null,
    })),
  [rollVol, rollMean, rollSharpe]);

  // Per-asset returns matrix → correlation
  const assets = useMemo(() => {
    const map: Record<string, number[]> = {};
    for (const t of sorted) {
      const sym = t.symbol || 'N/A';
      (map[sym] ||= []).push(Number(t.pnl) || 0);
    }
    return Object.entries(map)
      .filter(([, v]) => v.length >= 3)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10);
  }, [sorted]);

  const correlationMatrix = useMemo(() => {
    const N = assets.length;
    const out: { x: string; y: string; v: number }[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const a = assets[i][1], b = assets[j][1];
        const len = Math.min(a.length, b.length);
        out.push({ x: assets[i][0], y: assets[j][0], v: correlation(a.slice(0, len), b.slice(0, len)) });
      }
    }
    return out;
  }, [assets]);

  // Regime detection: rolling vol quantiles
  const regimes = useMemo(() => {
    const valid = rollVol.filter(Number.isFinite).sort((a, b) => a - b);
    if (valid.length === 0) return { lo: 0, hi: 0, current: 0, label: 'N/A' };
    const lo = valid[Math.floor(valid.length * 0.33)];
    const hi = valid[Math.floor(valid.length * 0.66)];
    const current = rollVol[rollVol.length - 1] || 0;
    let label = 'Calme';
    if (current > hi) label = 'Stressé';
    else if (current > lo) label = 'Normal';
    return { lo, hi, current, label };
  }, [rollVol]);

  // Efficient frontier (per-asset risk/return scatter)
  const frontier = useMemo(() =>
    assets.map(([sym, pnls]) => {
      const rs = pnls.map(p => p / cap);
      return {
        symbol: sym,
        risk: stdDev(rs) * Math.sqrt(TRADING_DAYS) * 100,
        ret: mean(rs) * TRADING_DAYS * 100,
        n: pnls.length,
      };
    }),
  [assets, cap]);

  // Risk decomposition (% of total variance)
  const riskDecomp = useMemo(() => {
    const totals = assets.map(([sym, p]) => ({
      sym, variance: (stdDev(p.map(x => x / cap)) ** 2) * p.length,
    }));
    const sum = totals.reduce((s, x) => s + x.variance, 0) || 1;
    return totals.map(t => ({ ...t, pct: (t.variance / sum) * 100 })).sort((a, b) => b.pct - a.pct);
  }, [assets, cap]);

  // Volatility clustering: ACF of |returns|
  const acf = useMemo(() => {
    const abs = returns.map(r => Math.abs(r));
    const m = mean(abs);
    const denom = abs.reduce((s, x) => s + (x - m) ** 2, 0) || 1;
    const lags = Math.min(20, Math.floor(abs.length / 3));
    const out: { lag: number; corr: number }[] = [];
    for (let k = 1; k <= lags; k++) {
      let num = 0;
      for (let i = k; i < abs.length; i++) num += (abs[i] - m) * (abs[i - k] - m);
      out.push({ lag: k, corr: num / denom });
    }
    return out;
  }, [returns]);

  // Beta proxy: correlation between trade returns and equity-curve returns
  const beta = useMemo(() => {
    const eqReturns: number[] = [];
    for (let i = 1; i < equity.length; i++) {
      const prev = equity[i - 1];
      eqReturns.push(prev ? (equity[i] - prev) / prev : 0);
    }
    return correlation(returns, eqReturns);
  }, [equity, returns]);

  if (trades.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Aucun trade pour le compte actif. Ajoute des trades pour débloquer les analytics quantitatives.
        </CardContent>
      </Card>
    );
  }

  const annualVol = stdDev(returns) * Math.sqrt(TRADING_DAYS) * 100;
  const totalReturn = ((equity[equity.length - 1] - cap) / cap) * 100;
  const maxDDPct = Math.min(...dd.map(d => d.drawdownPct));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DataCard title="Volatilité annualisée" value={`${annualVol.toFixed(1)}%`}
          icon={<Waves className="h-4 w-4" />} />
        <DataCard title="Régime actuel" value={regimes.label}
          valueClassName={regimes.label === 'Stressé' ? 'text-loss' : regimes.label === 'Calme' ? 'text-profit' : ''}
          icon={<Activity className="h-4 w-4" />}
          tooltip={`Vol courante ${regimes.current.toFixed(1)}% / bornes ${regimes.lo.toFixed(1)}–${regimes.hi.toFixed(1)}`} />
        <DataCard title="Beta intra-portefeuille" value={beta.toFixed(2)}
          icon={<Sigma className="h-4 w-4" />}
          tooltip="Corrélation trades vs equity curve" />
        <DataCard title="Drawdown max" value={`${maxDDPct.toFixed(1)}%`} valueClassName="text-loss"
          icon={<BarChart3 className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rolling volatility & rolling Sharpe ({ROLL} trades)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={rollingSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="i" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line yAxisId="left" dataKey="vol" stroke="hsl(var(--loss))" dot={false} strokeWidth={2} name="Vol annualisée %" connectNulls />
              <Line yAxisId="right" dataKey="sharpe" stroke="hsl(var(--primary))" dot={false} strokeWidth={2} name="Sharpe" connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Frontière efficiente — risque vs rendement par actif</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" dataKey="risk" name="Vol %" tick={{ fontSize: 10 }} />
                <YAxis type="number" dataKey="ret" name="Rendement %" tick={{ fontSize: 10 }} />
                <ZAxis type="number" dataKey="n" range={[60, 400]} name="Trades" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                <Scatter data={frontier} fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Volatility clustering (ACF de |returns|)</CardTitle>
            <p className="text-xs text-muted-foreground">Persistance de la volatilité — bars positives = clustering.</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={acf}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="lag" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[-0.5, 1]} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                <Area dataKey="corr" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.25)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Matrice de corrélation (PnL par actif)</CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length < 2 ? (
            <p className="text-sm text-muted-foreground">Au moins 2 actifs avec ≥ 3 trades requis.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="inline-grid" style={{ gridTemplateColumns: `120px repeat(${assets.length}, 56px)`, gap: 2 }}>
                <div />
                {assets.map(([s]) => (
                  <div key={s} className="text-[10px] text-muted-foreground text-center px-1 truncate">{s}</div>
                ))}
                {assets.map(([row]) => (
                  <Fragment key={row}>
                    <div className="text-xs text-muted-foreground pr-2 flex items-center justify-end truncate">{row}</div>
                    {assets.map(([col]) => {
                      const cell = correlationMatrix.find(c => c.x === row && c.y === col);
                      const v = cell?.v ?? 0;
                      const bg = v >= 0
                        ? `hsl(var(--primary) / ${0.1 + Math.abs(v) * 0.7})`
                        : `hsl(var(--loss) / ${0.1 + Math.abs(v) * 0.7})`;
                      return (
                        <div key={`${row}-${col}`} className="h-12 rounded-sm flex items-center justify-center text-[10px] font-medium border border-border/30"
                          style={{ background: bg }} title={`${row} ↔ ${col}: ${v.toFixed(2)}`}>
                          {v.toFixed(2)}
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Décomposition du risque (% variance par actif)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {riskDecomp.slice(0, 8).map(r => (
            <div key={r.sym}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{r.sym}</span>
                <span className="text-muted-foreground">{r.pct.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, r.pct)}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Equity & rendement composé ({fmt.format(equity[equity.length - 1])} — {totalReturn.toFixed(1)}%)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={equity.map((v, i) => ({ i, v }))}>
              <defs>
                <linearGradient id="quantEq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="i" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => fmt.format(v)} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                formatter={(v: any) => fmt.format(Number(v))} />
              <ReferenceLine y={cap} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
              <Area dataKey="v" stroke="hsl(var(--primary))" fill="url(#quantEq)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

