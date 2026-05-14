import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Archive, Check, Pencil, TrendingUp, TrendingDown } from 'lucide-react';
import { TradingAccount, AccountType } from '@/context/AccountContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const TYPE_LABEL: Record<AccountType, string> = { demo: 'Démo', live: 'Live', paper: 'Paper', prop_firm: 'Prop Firm' };
const TYPE_COLOR: Record<AccountType, string> = {
  demo: 'bg-muted text-muted-foreground',
  live: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  paper: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  prop_firm: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
};

interface Props {
  account: TradingAccount;
  active: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onArchive: () => void;
}

export function AccountCard({ account, active, onSelect, onEdit, onArchive }: Props) {
  const [stats, setStats] = useState({ totalPnl: 0, winRate: 0, trades: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('trades').select('pnl').eq('account_id', account.id);
      if (cancelled || !data) return;
      const trades = data.length;
      const wins = data.filter((t: any) => Number(t.pnl) > 0).length;
      const totalPnl = data.reduce((s: number, t: any) => s + (Number(t.pnl) || 0), 0);
      setStats({ totalPnl, winRate: trades ? (wins / trades) * 100 : 0, trades });
    })();
    return () => { cancelled = true; };
  }, [account.id]);

  const fmt = (v: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: account.currency }).format(v);

  return (
    <Card className={active ? 'ring-2 ring-primary' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base truncate">{account.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary" className={`text-[10px] ${TYPE_COLOR[account.account_type]}`}>
                {TYPE_LABEL[account.account_type]}
              </Badge>
              {account.broker && <span className="text-xs text-muted-foreground truncate">{account.broker}</span>}
              {account.prop_firm_status && (
                <Badge variant="outline" className="text-[10px] capitalize">
                  {account.prop_firm_status === 'evaluation' ? 'En évaluation' : account.prop_firm_status}
                </Badge>
              )}
            </div>
          </div>
          {active && <Badge className="text-[10px]">Actif</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs text-muted-foreground">Solde</div>
          <div className="text-2xl font-bold">{fmt(Number(account.balance))}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">PnL total</div>
            <div className={`font-semibold flex items-center gap-1 ${stats.totalPnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {stats.totalPnl >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {fmt(stats.totalPnl)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Win rate</div>
            <div className="font-semibold">{stats.winRate.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Trades</div>
            <div className="font-semibold">{stats.trades}</div>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          {!active && (
            <Button size="sm" variant="default" className="flex-1" onClick={onSelect}>
              <Check className="h-3.5 w-3.5 mr-1" /> Activer
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onEdit}><Pencil className="h-3.5 w-3.5" /></Button>
          {!account.archived && (
            <Button size="sm" variant="outline" onClick={onArchive}><Archive className="h-3.5 w-3.5" /></Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
