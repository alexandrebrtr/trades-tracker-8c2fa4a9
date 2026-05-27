import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataCard } from '@/components/ui/data-card';
import { Activity, TrendingUp, Clock, Wind, Compass, Zap } from 'lucide-react';
import { blackScholes, yearsTo, optionPayoff } from '@/utils/blackScholes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceLine,
  ScatterChart, Scatter, ZAxis, AreaChart, Area,
} from 'recharts';

interface Props { trades: any[] }

const fmt = (v: number, d = 4) => Number.isFinite(v) ? v.toFixed(d) : '—';
const fmtMoney = (v: number) =>
  Number.isFinite(v) ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v) : '—';

const computeGreeks = (t: any) => {
  if (t.delta !== null && t.delta !== undefined) {
    return {
      price: 0,
      delta: Number(t.delta) || 0,
      gamma: Number(t.gamma) || 0,
      theta: Number(t.theta) || 0,
      vega: Number(t.vega) || 0,
      rho: Number(t.rho) || 0,
      charm: 0, vanna: 0, vomma: 0, speed: 0, zomma: 0, d1: 0, d2: 0,
      computed: false,
    };
  }
  const S = Number(t.underlying_price) || Number(t.entry_price) || 0;
  const K = Number(t.strike) || 0;
  const T = t.expiration ? yearsTo(t.expiration) : 0.25;
  const r = Number(t.risk_free_rate) ?? 0.04;
  const sigma = Number(t.implied_volatility) || 0.2;
  const type = (t.option_type as 'call' | 'put') || 'call';
  return { ...blackScholes({ S, K, T, r, sigma, type }), computed: true };
};

export function GreeksExposure({ trades }: Props) {
  const options = useMemo(
    () => trades.filter(t => t.asset_class === 'options' || t.option_type),
    [trades],
  );

  const enriched = useMemo(() =>
    options.map(t => {
      const g = computeGreeks(t);
      const size = Number(t.size) || 1;
      const cs = Number(t.contract_size) || 100;
      const sign = (t.type === 'short' ? -1 : 1);
      const mult = sign * size * cs;
      return {
        ...t, greeks: g,
        moneyness: Number(t.underlying_price) && Number(t.strike)
          ? (Number(t.underlying_price) / Number(t.strike))
          : 1,
        exposure: {
          delta: g.delta * mult, gamma: g.gamma * mult, theta: g.theta * mult,
          vega: g.vega * mult, rho: g.rho * mult,
          charm: g.charm * mult, vanna: g.vanna * mult, vomma: g.vomma * mult,
        },
      };
    }), [options]);

  const portfolio = enriched.reduce(
    (acc, e) => ({
      delta: acc.delta + e.exposure.delta,
      gamma: acc.gamma + e.exposure.gamma,
      theta: acc.theta + e.exposure.theta,
      vega: acc.vega + e.exposure.vega,
      rho: acc.rho + e.exposure.rho,
      charm: acc.charm + e.exposure.charm,
      vanna: acc.vanna + e.exposure.vanna,
      vomma: acc.vomma + e.exposure.vomma,
    }),
    { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0, charm: 0, vanna: 0, vomma: 0 },
  );

  // Scenario simulation
  const [shockSpot, setShockSpot] = useState(0); // %
  const [shockVol, setShockVol] = useState(0); // bps of vol
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');

  const symbols = useMemo(() => Array.from(new Set(enriched.map(e => e.symbol))).filter(Boolean), [enriched]);
  const focused = useMemo(() =>
    selectedSymbol ? enriched.find(e => e.symbol === selectedSymbol) : enriched[0],
  [selectedSymbol, enriched]);

  // Payoff diagram for focused position
  const payoffData = useMemo(() => {
    if (!focused) return [];
    const S0 = Number(focused.underlying_price) || Number(focused.entry_price) || 100;
    const K = Number(focused.strike) || S0;
    const premium = Number(focused.premium) || Number(focused.entry_price) || 0;
    const side = (focused.type === 'short' ? 'short' : 'long') as 'long' | 'short';
    const type = (focused.option_type as 'call' | 'put') || 'call';
    const size = Number(focused.size) || 1;
    const cs = Number(focused.contract_size) || 100;
    const out: { S: number; payoff: number; current: number }[] = [];
    const lo = S0 * 0.6, hi = S0 * 1.4;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const S = lo + (hi - lo) * (i / steps);
      const payoff = optionPayoff(S, K, type, side, premium, size, cs);
      // Approx current value using BS
      const T = focused.expiration ? yearsTo(focused.expiration) : 0.25;
      const sigma = Number(focused.implied_volatility) || 0.2;
      const bs = blackScholes({ S, K, T, r: 0.04, sigma, type });
      const sign = side === 'long' ? 1 : -1;
      const current = (bs.price - premium) * sign * size * cs;
      out.push({ S, payoff, current });
    }
    return out;
  }, [focused]);

  // Theta decay over time (focused position)
  const thetaDecay = useMemo(() => {
    if (!focused) return [];
    const S = Number(focused.underlying_price) || Number(focused.entry_price) || 100;
    const K = Number(focused.strike) || S;
    const sigma = Number(focused.implied_volatility) || 0.2;
    const type = (focused.option_type as 'call' | 'put') || 'call';
    const totalT = focused.expiration ? yearsTo(focused.expiration) : 0.25;
    const out: { days: number; price: number }[] = [];
    const steps = 30;
    for (let i = steps; i >= 0; i--) {
      const T = (totalT * i) / steps;
      const bs = blackScholes({ S, K, T: Math.max(1 / 365, T), r: 0.04, sigma, type });
      out.push({ days: Math.round(T * 365), price: bs.price });
    }
    return out;
  }, [focused]);

  // Volatility smile across strikes
  const smileData = useMemo(() => {
    const bySym: Record<string, { strike: number; iv: number; type: string }[]> = {};
    for (const o of options) {
      if (!o.symbol || !o.strike || !o.implied_volatility) continue;
      (bySym[o.symbol] ||= []).push({
        strike: Number(o.strike),
        iv: Number(o.implied_volatility) * 100,
        type: o.option_type,
      });
    }
    return Object.entries(bySym).map(([sym, pts]) => ({
      symbol: sym,
      data: pts.sort((a, b) => a.strike - b.strike),
    }));
  }, [options]);

  // P&L under spot / vol shock (whole portfolio approximation via greeks)
  const shockPnl = useMemo(() => {
    let pnl = 0;
    const refSpot = enriched[0] ? (Number(enriched[0].underlying_price) || 100) : 100;
    const dS = refSpot * (shockSpot / 100);
    const dVolPct = shockVol; // already in 1%-units
    pnl += portfolio.delta * dS;
    pnl += 0.5 * portfolio.gamma * dS * dS;
    pnl += portfolio.vega * dVolPct;
    return pnl;
  }, [portfolio, shockSpot, shockVol, enriched]);

  if (options.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Aucune option enregistrée. Les Greeks, payoff diagrams et volatility smile apparaîtront ici dès que tu ajouteras des trades d'options.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greek exposure */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" /> Exposition globale aux Greeks
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <DataCard title="Delta total" value={fmt(portfolio.delta, 2)}
            valueClassName={portfolio.delta >= 0 ? 'text-profit' : 'text-loss'}
            icon={<TrendingUp className="h-4 w-4" />} tooltip="Sensibilité directionnelle" />
          <DataCard title="Gamma total" value={fmt(portfolio.gamma, 4)}
            icon={<Activity className="h-4 w-4" />} tooltip="Convexité du delta" />
          <DataCard title="Theta total" value={fmt(portfolio.theta, 2)}
            valueClassName={portfolio.theta >= 0 ? 'text-profit' : 'text-loss'}
            icon={<Clock className="h-4 w-4" />} tooltip="Décroissance temporelle/jour" />
          <DataCard title="Vega total" value={fmt(portfolio.vega, 2)}
            icon={<Wind className="h-4 w-4" />} tooltip="Sensibilité IV (par 1%)" />
          <DataCard title="Rho total" value={fmt(portfolio.rho, 2)}
            icon={<Activity className="h-4 w-4" />} tooltip="Sensibilité taux (par 1%)" />
          <DataCard title="Charm" value={fmt(portfolio.charm, 4)}
            icon={<Clock className="h-4 w-4" />} tooltip="dDelta/dT — drift du delta" />
          <DataCard title="Vanna" value={fmt(portfolio.vanna, 4)}
            icon={<Wind className="h-4 w-4" />} tooltip="dDelta/dVol — couplage spot/vol" />
          <DataCard title="Vomma" value={fmt(portfolio.vomma, 4)}
            icon={<Zap className="h-4 w-4" />} tooltip="dVega/dVol — convexité vol" />
        </div>
      </section>

      {/* Scenario shocks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" /> Simulateur de chocs (spot & volatilité)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2">
            <Label className="text-xs">Choc spot: <span className="font-semibold">{shockSpot.toFixed(1)}%</span></Label>
            <Slider min={-30} max={30} step={0.5} value={[shockSpot]} onValueChange={([v]) => setShockSpot(v)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Choc IV: <span className="font-semibold">{shockVol.toFixed(1)} pts</span></Label>
            <Slider min={-30} max={30} step={0.5} value={[shockVol]} onValueChange={([v]) => setShockVol(v)} />
          </div>
          <div className="text-center md:text-right">
            <div className="text-xs text-muted-foreground">P&L estimé sous choc</div>
            <div className={`text-2xl font-bold ${shockPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
              {fmtMoney(shockPnl)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Focused position picker + payoff + theta */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-base">Analyse de position</CardTitle>
          {symbols.length > 0 && (
            <Select value={selectedSymbol || symbols[0]} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Symbole" /></SelectTrigger>
              <SelectContent>
                {symbols.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-2">Payoff diagram (à l'expiration vs actuel)</div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={payoffData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="S" tick={{ fontSize: 10 }} tickFormatter={(v) => Number(v).toFixed(0)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(v: any) => fmtMoney(Number(v))}
                  labelFormatter={(v) => `Spot ${Number(v).toFixed(2)}`} />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                <Area dataKey="payoff" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Expiration" />
                <Area dataKey="current" stroke="hsl(var(--profit))" fill="transparent" name="Valeur actuelle" strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Theta decay — valeur de l'option dans le temps</div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={thetaDecay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="days" tick={{ fontSize: 10 }} label={{ value: 'Jours restants', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Line dataKey="price" stroke="hsl(var(--loss))" dot={false} strokeWidth={2} name="Prix BS" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Volatility smile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Volatility smile / skew (IV vs strike)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" dataKey="strike" name="Strike" tick={{ fontSize: 10 }} />
              <YAxis type="number" dataKey="iv" name="IV %" tick={{ fontSize: 10 }} />
              <ZAxis range={[60, 60]} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              {smileData.map((s, i) => (
                <Scatter key={s.symbol} name={s.symbol} data={s.data}
                  fill={`hsl(${(i * 67) % 360} 70% 55%)`} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table of all positions */}
      <Card>
        <CardHeader><CardTitle className="text-base">Détail par position</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbole</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Strike</TableHead>
                <TableHead>Money.</TableHead>
                <TableHead>Δ</TableHead>
                <TableHead>Γ</TableHead>
                <TableHead>Θ</TableHead>
                <TableHead>ν</TableHead>
                <TableHead>Vanna</TableHead>
                <TableHead>Vomma</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enriched.map((e, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{e.symbol}</TableCell>
                  <TableCell className="uppercase">{e.option_type}</TableCell>
                  <TableCell>{fmt(Number(e.strike), 2)}</TableCell>
                  <TableCell>{fmt(e.moneyness, 2)}</TableCell>
                  <TableCell>{fmt(e.greeks.delta)}</TableCell>
                  <TableCell>{fmt(e.greeks.gamma)}</TableCell>
                  <TableCell>{fmt(e.greeks.theta)}</TableCell>
                  <TableCell>{fmt(e.greeks.vega)}</TableCell>
                  <TableCell>{fmt(e.greeks.vanna)}</TableCell>
                  <TableCell>{fmt(e.greeks.vomma)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
