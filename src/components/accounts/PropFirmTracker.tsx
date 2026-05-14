import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2, Trophy } from 'lucide-react';
import { TradingAccount } from '@/context/AccountContext';

interface Props {
  account: TradingAccount;
  trades: any[];
}

export function PropFirmTracker({ account, trades }: Props) {
  if (account.account_type !== 'prop_firm') return null;

  const initialCapital = Number(account.initial_capital) || 0;
  const currentBalance = Number(account.balance) || 0;
  const totalPnl = currentBalance - initialCapital;
  const profitPct = initialCapital > 0 ? (totalPnl / initialCapital) * 100 : 0;
  const profitTarget = Number(account.profit_target) || 0;

  // Equity curve & drawdown
  const sorted = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let peak = initialCapital;
  let maxDD = 0;
  let equity = initialCapital;
  for (const t of sorted) {
    equity += Number(t.pnl) || 0;
    if (equity > peak) peak = equity;
    const dd = peak > 0 ? ((peak - equity) / peak) * 100 : 0;
    if (dd > maxDD) maxDD = dd;
  }
  const currentDD = peak > 0 ? ((peak - currentBalance) / peak) * 100 : 0;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dailyPnl = trades
    .filter(t => new Date(t.date) >= today)
    .reduce((s, t) => s + (Number(t.pnl) || 0), 0);
  const dailyDDPct = initialCapital > 0 ? (Math.min(0, dailyPnl) / initialCapital) * -100 : 0;

  const maxDDLimit = Number(account.max_drawdown) || 0;
  const dailyDDLimit = Number(account.daily_drawdown) || 0;

  const ddViolation = maxDDLimit > 0 && currentDD > maxDDLimit;
  const dailyViolation = dailyDDLimit > 0 && dailyDDPct > dailyDDLimit;
  const targetReached = profitTarget > 0 && profitPct >= profitTarget;
  const violation = ddViolation || dailyViolation;

  const statusBadge = () => {
    switch (account.prop_firm_status) {
      case 'funded': return <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"><Trophy className="h-3 w-3 mr-1" />Funded</Badge>;
      case 'passed': return <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400">Passed</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="outline">En évaluation</Badge>;
    }
  };

  return (
    <Card className="border-violet-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-violet-500" />
              Suivi Prop Firm — {account.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{account.broker}</p>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge()}
            {violation ? (
              <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Violation</Badge>
            ) : (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 gap-1">
                <CheckCircle2 className="h-3 w-3" />Règles respectées
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {profitTarget > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Objectif de profit</span>
              <span className={targetReached ? 'text-emerald-500 font-semibold' : ''}>
                {profitPct.toFixed(2)}% / {profitTarget}%
              </span>
            </div>
            <Progress value={Math.min(100, (profitPct / profitTarget) * 100)} className="h-2" />
          </div>
        )}
        {maxDDLimit > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Drawdown maximal</span>
              <span className={ddViolation ? 'text-red-500 font-semibold' : ''}>
                {currentDD.toFixed(2)}% / {maxDDLimit}%
              </span>
            </div>
            <Progress value={Math.min(100, (currentDD / maxDDLimit) * 100)} className={`h-2 ${currentDD / maxDDLimit > 0.8 ? '[&>div]:bg-red-500' : ''}`} />
          </div>
        )}
        {dailyDDLimit > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Daily drawdown</span>
              <span className={dailyViolation ? 'text-red-500 font-semibold' : ''}>
                {dailyDDPct.toFixed(2)}% / {dailyDDLimit}%
              </span>
            </div>
            <Progress value={Math.min(100, (dailyDDPct / dailyDDLimit) * 100)} className={`h-2 ${dailyDDPct / dailyDDLimit > 0.8 ? '[&>div]:bg-red-500' : ''}`} />
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
          <Stat label="Drawdown max atteint" value={`${maxDD.toFixed(2)}%`} />
          <Stat label="PnL total" value={new Intl.NumberFormat('fr-FR', { style: 'currency', currency: account.currency }).format(totalPnl)} positive={totalPnl >= 0} />
          <Stat label="Trades" value={String(trades.length)} />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-base font-semibold ${positive === true ? 'text-emerald-500' : positive === false ? 'text-red-500' : ''}`}>{value}</div>
    </div>
  );
}
