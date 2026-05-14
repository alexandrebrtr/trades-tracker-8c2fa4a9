import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useAccount, TradingAccount, AccountType, PropFirmStatus } from '@/context/AccountContext';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  account?: TradingAccount | null;
}

export function AccountForm({ open, onOpenChange, account }: Props) {
  const { user } = useAuth();
  const { refresh, setActiveAccountId } = useAccount();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [broker, setBroker] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [accountType, setAccountType] = useState<AccountType>('live');
  const [initialCapital, setInitialCapital] = useState('10000');
  const [leverage, setLeverage] = useState('1');
  const [profitTarget, setProfitTarget] = useState('');
  const [maxDrawdown, setMaxDrawdown] = useState('');
  const [dailyDrawdown, setDailyDrawdown] = useState('');
  const [propFirmStatus, setPropFirmStatus] = useState<PropFirmStatus>('evaluation');

  useEffect(() => {
    if (account) {
      setName(account.name);
      setBroker(account.broker || '');
      setCurrency(account.currency);
      setAccountType(account.account_type);
      setInitialCapital(String(account.initial_capital));
      setLeverage(String(account.leverage));
      setProfitTarget(account.profit_target ? String(account.profit_target) : '');
      setMaxDrawdown(account.max_drawdown ? String(account.max_drawdown) : '');
      setDailyDrawdown(account.daily_drawdown ? String(account.daily_drawdown) : '');
      setPropFirmStatus(account.prop_firm_status || 'evaluation');
    } else {
      setName(''); setBroker(''); setCurrency('EUR'); setAccountType('live');
      setInitialCapital('10000'); setLeverage('1');
      setProfitTarget(''); setMaxDrawdown(''); setDailyDrawdown('');
      setPropFirmStatus('evaluation');
    }
  }, [account, open]);

  const submit = async () => {
    if (!user || !name.trim()) {
      toast({ title: 'Nom requis', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const num = (s: string) => s ? parseFloat(s.replace(',', '.')) : null;
    const payload: any = {
      user_id: user.id,
      name: name.trim(),
      broker: broker.trim() || null,
      currency,
      account_type: accountType,
      initial_capital: num(initialCapital) ?? 0,
      leverage: num(leverage) ?? 1,
      profit_target: num(profitTarget),
      max_drawdown: num(maxDrawdown),
      daily_drawdown: num(dailyDrawdown),
      prop_firm_status: accountType === 'prop_firm' ? propFirmStatus : null,
    };
    let res;
    if (account) {
      res = await supabase.from('trading_accounts' as any).update(payload).eq('id', account.id);
    } else {
      res = await supabase.from('trading_accounts' as any).insert(payload).select().single();
    }
    setSubmitting(false);
    if (res.error) {
      toast({ title: 'Erreur', description: res.error.message, variant: 'destructive' });
      return;
    }
    toast({ title: account ? 'Compte mis à jour' : 'Compte créé' });
    await refresh();
    if (!account && (res as any).data?.id) setActiveAccountId((res as any).data.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{account ? 'Modifier le compte' : 'Nouveau compte de trading'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nom</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: FTMO 100K" />
            </div>
            <div>
              <Label>Broker / Prop firm</Label>
              <Input value={broker} onChange={e => setBroker(e.target.value)} placeholder="Ex: FTMO, IC Markets" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={accountType} onValueChange={(v) => setAccountType(v as AccountType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="demo">Démo</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="paper">Paper trading</SelectItem>
                  <SelectItem value="prop_firm">Prop Firm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Devise</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Levier</Label>
              <Input type="number" value={leverage} onChange={e => setLeverage(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Capital initial</Label>
              <Input type="number" value={initialCapital} onChange={e => setInitialCapital(e.target.value)} />
            </div>
            <div>
              <Label>Objectif de profit (%)</Label>
              <Input type="number" value={profitTarget} onChange={e => setProfitTarget(e.target.value)} placeholder="Ex: 10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Drawdown max (%)</Label>
              <Input type="number" value={maxDrawdown} onChange={e => setMaxDrawdown(e.target.value)} placeholder="Ex: 10" />
            </div>
            <div>
              <Label>Daily drawdown (%)</Label>
              <Input type="number" value={dailyDrawdown} onChange={e => setDailyDrawdown(e.target.value)} placeholder="Ex: 5" />
            </div>
          </div>
          {accountType === 'prop_firm' && (
            <div>
              <Label>Statut prop firm</Label>
              <Select value={propFirmStatus} onValueChange={(v) => setPropFirmStatus(v as PropFirmStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="evaluation">En évaluation</SelectItem>
                  <SelectItem value="funded">Funded</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={submit} disabled={submitting}>{account ? 'Enregistrer' : 'Créer le compte'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
