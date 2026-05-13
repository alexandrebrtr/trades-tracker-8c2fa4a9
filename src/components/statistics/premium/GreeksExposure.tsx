import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataCard } from '@/components/ui/data-card';
import { Activity, TrendingUp, Clock, Wind, Compass } from 'lucide-react';
import { blackScholes, yearsTo } from '@/utils/blackScholes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GreeksExposureProps {
  trades: any[];
}

const fmt = (v: number, d = 4) => Number.isFinite(v) ? v.toFixed(d) : '—';

const computeGreeks = (t: any) => {
  // If user provided manual greeks, use them; else derive via Black-Scholes
  if (t.delta !== null && t.delta !== undefined) {
    return {
      delta: Number(t.delta) || 0,
      gamma: Number(t.gamma) || 0,
      theta: Number(t.theta) || 0,
      vega: Number(t.vega) || 0,
      rho: Number(t.rho) || 0,
      computed: false,
    };
  }
  const S = Number(t.underlying_price) || Number(t.entry_price) || 0;
  const K = Number(t.strike) || 0;
  const T = t.expiration ? yearsTo(t.expiration) : 0.25;
  const r = Number(t.risk_free_rate) ?? 0.04;
  const sigma = Number(t.implied_volatility) || 0.2;
  const type = (t.option_type as 'call' | 'put') || 'call';
  const g = blackScholes({ S, K, T, r, sigma, type });
  return { ...g, computed: true };
};

export function GreeksExposure({ trades }: GreeksExposureProps) {
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
      return { ...t, greeks: g, exposure: {
        delta: g.delta * mult,
        gamma: g.gamma * mult,
        theta: g.theta * mult,
        vega: g.vega * mult,
        rho: g.rho * mult,
      }};
    }),
  [options]);

  const portfolio = enriched.reduce(
    (acc, e) => ({
      delta: acc.delta + e.exposure.delta,
      gamma: acc.gamma + e.exposure.gamma,
      theta: acc.theta + e.exposure.theta,
      vega: acc.vega + e.exposure.vega,
      rho: acc.rho + e.exposure.rho,
    }),
    { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 },
  );

  if (options.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Aucune option enregistrée. Les Greeks et l'exposition apparaîtront ici dès que tu ajouteras des trades d'options.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" /> Exposition globale du portefeuille (Greeks pondérés)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <DataCard title="Delta total" value={fmt(portfolio.delta, 2)}
            valueClassName={portfolio.delta >= 0 ? 'text-profit' : 'text-loss'}
            icon={<TrendingUp className="h-4 w-4" />}
            tooltip="Sensibilité directionnelle au sous-jacent" />
          <DataCard title="Gamma total" value={fmt(portfolio.gamma, 4)}
            icon={<Activity className="h-4 w-4" />}
            tooltip="Convexité — accélération du delta" />
          <DataCard title="Theta total" value={fmt(portfolio.theta, 2)}
            valueClassName={portfolio.theta >= 0 ? 'text-profit' : 'text-loss'}
            icon={<Clock className="h-4 w-4" />}
            tooltip="Décroissance temporelle quotidienne" />
          <DataCard title="Vega total" value={fmt(portfolio.vega, 2)}
            icon={<Wind className="h-4 w-4" />}
            tooltip="Sensibilité à la volatilité implicite (par 1%)" />
          <DataCard title="Rho total" value={fmt(portfolio.rho, 2)}
            icon={<Activity className="h-4 w-4" />}
            tooltip="Sensibilité aux taux d'intérêt (par 1%)" />
        </div>
      </section>

      <Card>
        <CardHeader><CardTitle className="text-base">Détail par position d'options</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbole</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Strike</TableHead>
                <TableHead>Δ</TableHead>
                <TableHead>Γ</TableHead>
                <TableHead>Θ</TableHead>
                <TableHead>ν (Vega)</TableHead>
                <TableHead>ρ</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enriched.map((e, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{e.symbol}</TableCell>
                  <TableCell className="uppercase">{e.option_type}</TableCell>
                  <TableCell>{fmt(Number(e.strike), 2)}</TableCell>
                  <TableCell>{fmt(e.greeks.delta)}</TableCell>
                  <TableCell>{fmt(e.greeks.gamma)}</TableCell>
                  <TableCell>{fmt(e.greeks.theta)}</TableCell>
                  <TableCell>{fmt(e.greeks.vega)}</TableCell>
                  <TableCell>{fmt(e.greeks.rho)}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {e.greeks.computed ? 'Black-Scholes' : 'Manuel'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
