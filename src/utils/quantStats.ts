/**
 * Institutional-grade quantitative statistics for trading performance.
 * All ratios are computed on per-trade PnL series (in account currency),
 * then annualised when relevant using sqrt-of-time rule (252 sessions).
 */

const TRADING_DAYS = 252;

export interface QuantMetrics {
  totalReturn: number;
  totalReturnPct: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  profitFactor: number;
  recoveryFactor: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  omegaRatio: number;
  maxDrawdown: number;
  maxDrawdownPct: number;
  avgDrawdown: number;
  avgDrawdownPct: number;
  volatility: number;
  downsideDeviation: number;
  valueAtRisk95: number;
  conditionalVaR95: number;
  riskOfRuin: number;
  bestTrade: number;
  worstTrade: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  payoffRatio: number;
  cagr: number;
  tradeCount: number;
}

const safe = (n: number) => (Number.isFinite(n) ? n : 0);

export const mean = (xs: number[]) =>
  xs.length === 0 ? 0 : xs.reduce((s, x) => s + x, 0) / xs.length;

export const stdDev = (xs: number[]) => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const v = xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(v);
};

export const downsideDev = (xs: number[], target = 0) => {
  if (xs.length < 2) return 0;
  const downside = xs.map(x => Math.min(0, x - target) ** 2);
  return Math.sqrt(downside.reduce((s, x) => s + x, 0) / xs.length);
};

/** Equity curve from PnL series + initial capital. */
export const equityCurve = (pnls: number[], initialCapital: number): number[] => {
  const out = [initialCapital];
  for (const p of pnls) out.push(out[out.length - 1] + p);
  return out;
};

/** Returns [{drawdown $, drawdown %}] series for an equity curve. */
export const drawdownSeries = (equity: number[]) => {
  let peak = equity[0] ?? 0;
  return equity.map(v => {
    if (v > peak) peak = v;
    const dd = v - peak;
    const ddPct = peak !== 0 ? (dd / peak) * 100 : 0;
    return { equity: v, drawdown: dd, drawdownPct: ddPct };
  });
};

export const maxDrawdown = (equity: number[]) => {
  const dd = drawdownSeries(equity);
  let maxDD = 0;
  let maxDDPct = 0;
  for (const d of dd) {
    if (d.drawdown < maxDD) maxDD = d.drawdown;
    if (d.drawdownPct < maxDDPct) maxDDPct = d.drawdownPct;
  }
  return { maxDD: Math.abs(maxDD), maxDDPct: Math.abs(maxDDPct) };
};

export const avgDrawdown = (equity: number[]) => {
  const dd = drawdownSeries(equity);
  const negs = dd.filter(d => d.drawdown < 0);
  if (negs.length === 0) return { avgDD: 0, avgDDPct: 0 };
  return {
    avgDD: Math.abs(mean(negs.map(d => d.drawdown))),
    avgDDPct: Math.abs(mean(negs.map(d => d.drawdownPct))),
  };
};

/** Sharpe (annualised) on per-trade returns (ratio of pnl/initial). */
export const sharpe = (returns: number[], rfPerPeriod = 0) => {
  const sd = stdDev(returns);
  if (sd === 0) return 0;
  return ((mean(returns) - rfPerPeriod) / sd) * Math.sqrt(TRADING_DAYS);
};

export const sortino = (returns: number[], target = 0) => {
  const dd = downsideDev(returns, target);
  if (dd === 0) return 0;
  return ((mean(returns) - target) / dd) * Math.sqrt(TRADING_DAYS);
};

export const omega = (returns: number[], threshold = 0) => {
  const gains = returns.filter(r => r > threshold).reduce((s, r) => s + (r - threshold), 0);
  const losses = returns.filter(r => r < threshold).reduce((s, r) => s + (threshold - r), 0);
  if (losses === 0) return gains > 0 ? Infinity : 0;
  return gains / losses;
};

/** Historical Value at Risk at confidence level (e.g. 0.95). */
export const valueAtRisk = (returns: number[], confidence = 0.95) => {
  if (returns.length === 0) return 0;
  const sorted = [...returns].sort((a, b) => a - b);
  const idx = Math.floor((1 - confidence) * sorted.length);
  return Math.abs(sorted[Math.max(0, idx)]);
};

/** Conditional VaR (Expected Shortfall) — average loss beyond VaR. */
export const conditionalVaR = (returns: number[], confidence = 0.95) => {
  if (returns.length === 0) return 0;
  const sorted = [...returns].sort((a, b) => a - b);
  const cutoff = Math.max(1, Math.floor((1 - confidence) * sorted.length));
  const tail = sorted.slice(0, cutoff);
  return Math.abs(mean(tail));
};

/**
 * Risk of Ruin (Kelly approximation): probability that an equity series
 * trading with given winrate w and payoff p eventually loses everything,
 * stopping after `units` of capital lost.
 */
export const riskOfRuin = (winRate: number, payoffRatio: number, units = 20) => {
  const w = Math.min(0.999, Math.max(0.001, winRate));
  const l = 1 - w;
  if (payoffRatio <= 0) return 1;
  const edge = w * payoffRatio - l;
  if (edge <= 0) return 1;
  const a = (1 - edge) / (1 + edge);
  return Math.min(1, Math.max(0, Math.pow(a, units)));
};

/** Longest streaks of wins / losses in chronological order. */
export const streaks = (pnls: number[]) => {
  let curW = 0, curL = 0, maxW = 0, maxL = 0;
  for (const p of pnls) {
    if (p > 0) { curW++; curL = 0; if (curW > maxW) maxW = curW; }
    else if (p < 0) { curL++; curW = 0; if (curL > maxL) maxL = curL; }
    else { curW = 0; curL = 0; }
  }
  return { maxConsecutiveWins: maxW, maxConsecutiveLosses: maxL };
};

export const computeQuantMetrics = (
  trades: { date?: string; pnl?: number | null }[],
  initialCapital = 10000,
): QuantMetrics => {
  const sorted = [...trades]
    .filter(t => Number.isFinite(Number(t.pnl)))
    .sort((a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime());
  const pnls = sorted.map(t => Number(t.pnl) || 0);

  if (pnls.length === 0) {
    return {
      totalReturn: 0, totalReturnPct: 0, winRate: 0, avgWin: 0, avgLoss: 0,
      expectancy: 0, profitFactor: 0, recoveryFactor: 0, sharpeRatio: 0,
      sortinoRatio: 0, calmarRatio: 0, omegaRatio: 0, maxDrawdown: 0,
      maxDrawdownPct: 0, avgDrawdown: 0, avgDrawdownPct: 0, volatility: 0,
      downsideDeviation: 0, valueAtRisk95: 0, conditionalVaR95: 0,
      riskOfRuin: 0, bestTrade: 0, worstTrade: 0, consecutiveWins: 0,
      consecutiveLosses: 0, payoffRatio: 0, cagr: 0, tradeCount: 0,
    };
  }

  const cap = initialCapital > 0 ? initialCapital : 10000;
  const returns = pnls.map(p => p / cap);
  const equity = equityCurve(pnls, cap);

  const wins = pnls.filter(p => p > 0);
  const losses = pnls.filter(p => p < 0);
  const totalReturn = pnls.reduce((s, p) => s + p, 0);
  const winRate = wins.length / pnls.length;
  const avgWin = wins.length ? mean(wins) : 0;
  const avgLoss = losses.length ? Math.abs(mean(losses)) : 0;
  const grossProfit = wins.reduce((s, p) => s + p, 0);
  const grossLoss = Math.abs(losses.reduce((s, p) => s + p, 0));
  const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? 99 : 0) : grossProfit / grossLoss;
  const expectancy = winRate * avgWin - (1 - winRate) * avgLoss;
  const payoffRatio = avgLoss === 0 ? (avgWin > 0 ? 99 : 0) : avgWin / avgLoss;

  const { maxDD, maxDDPct } = maxDrawdown(equity);
  const { avgDD, avgDDPct } = avgDrawdown(equity);
  const recoveryFactor = maxDD === 0 ? (totalReturn > 0 ? 99 : 0) : totalReturn / maxDD;

  // CAGR from first to last date
  const firstDate = new Date(sorted[0].date ?? Date.now()).getTime();
  const lastDate = new Date(sorted[sorted.length - 1].date ?? Date.now()).getTime();
  const years = Math.max(1 / 365, (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 365));
  const finalEquity = equity[equity.length - 1];
  const cagr = finalEquity > 0 && cap > 0
    ? (Math.pow(finalEquity / cap, 1 / years) - 1) * 100
    : 0;
  const calmarRatio = maxDDPct === 0 ? 0 : cagr / maxDDPct;

  const { maxConsecutiveWins, maxConsecutiveLosses } = streaks(pnls);

  return {
    totalReturn: safe(totalReturn),
    totalReturnPct: safe((totalReturn / cap) * 100),
    winRate: safe(winRate * 100),
    avgWin: safe(avgWin),
    avgLoss: safe(avgLoss),
    expectancy: safe(expectancy),
    profitFactor: safe(profitFactor),
    recoveryFactor: safe(recoveryFactor),
    sharpeRatio: safe(sharpe(returns)),
    sortinoRatio: safe(sortino(returns)),
    calmarRatio: safe(calmarRatio),
    omegaRatio: safe(omega(returns)),
    maxDrawdown: safe(maxDD),
    maxDrawdownPct: safe(maxDDPct),
    avgDrawdown: safe(avgDD),
    avgDrawdownPct: safe(avgDDPct),
    volatility: safe(stdDev(returns) * Math.sqrt(TRADING_DAYS) * 100),
    downsideDeviation: safe(downsideDev(returns) * Math.sqrt(TRADING_DAYS) * 100),
    valueAtRisk95: safe(valueAtRisk(pnls, 0.95)),
    conditionalVaR95: safe(conditionalVaR(pnls, 0.95)),
    riskOfRuin: safe(riskOfRuin(winRate, payoffRatio) * 100),
    bestTrade: safe(Math.max(...pnls)),
    worstTrade: safe(Math.min(...pnls)),
    consecutiveWins: maxConsecutiveWins,
    consecutiveLosses: maxConsecutiveLosses,
    payoffRatio: safe(payoffRatio),
    cagr: safe(cagr),
    tradeCount: pnls.length,
  };
};

/** Return distribution histogram (bucketed PnL counts). */
export const returnDistribution = (pnls: number[], buckets = 20) => {
  if (pnls.length === 0) return [];
  const min = Math.min(...pnls);
  const max = Math.max(...pnls);
  if (min === max) return [{ bucket: min.toFixed(2), count: pnls.length, value: min }];
  const step = (max - min) / buckets;
  const out: { bucket: string; count: number; value: number }[] = [];
  for (let i = 0; i < buckets; i++) {
    const lo = min + i * step;
    const hi = lo + step;
    const count = pnls.filter(p => p >= lo && (i === buckets - 1 ? p <= hi : p < hi)).length;
    out.push({ bucket: `${lo.toFixed(0)}`, count, value: (lo + hi) / 2 });
  }
  return out;
};

/** Performance heatmap by weekday × hour. */
export const performanceHeatmap = (
  trades: { date?: string; pnl?: number | null }[],
) => {
  const grid: { day: number; hour: number; pnl: number; count: number }[] = [];
  const map = new Map<string, { pnl: number; count: number }>();
  for (const t of trades) {
    if (!t.date) continue;
    const d = new Date(t.date);
    const key = `${d.getDay()}-${d.getHours()}`;
    const cur = map.get(key) ?? { pnl: 0, count: 0 };
    cur.pnl += Number(t.pnl) || 0;
    cur.count += 1;
    map.set(key, cur);
  }
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const cur = map.get(`${day}-${hour}`) ?? { pnl: 0, count: 0 };
      grid.push({ day, hour, pnl: cur.pnl, count: cur.count });
    }
  }
  return grid;
};

/** Performance by trading session (Asia / London / NY) using UTC hour. */
export const performanceBySession = (
  trades: { date?: string; pnl?: number | null }[],
) => {
  const sessions = {
    Asia: { range: [0, 7], pnl: 0, count: 0, wins: 0 },
    London: { range: [7, 13], pnl: 0, count: 0, wins: 0 },
    NewYork: { range: [13, 21], pnl: 0, count: 0, wins: 0 },
    Overnight: { range: [21, 24], pnl: 0, count: 0, wins: 0 },
  };
  for (const t of trades) {
    if (!t.date) continue;
    const h = new Date(t.date).getUTCHours();
    const pnl = Number(t.pnl) || 0;
    let key: keyof typeof sessions = 'Overnight';
    if (h < 7) key = 'Asia';
    else if (h < 13) key = 'London';
    else if (h < 21) key = 'NewYork';
    sessions[key].pnl += pnl;
    sessions[key].count += 1;
    if (pnl > 0) sessions[key].wins += 1;
  }
  return Object.entries(sessions).map(([name, s]) => ({
    session: name,
    pnl: s.pnl,
    count: s.count,
    winRate: s.count ? (s.wins / s.count) * 100 : 0,
  }));
};
