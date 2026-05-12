import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Minus, Wallet, TrendingUp, TrendingDown, CalendarIcon, Trash2 } from 'lucide-react';
import { DataCard } from '@/components/ui/data-card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface CapitalManagementProps {
  portfolioId: string | null;
  portfolioSize: number;
  setPortfolioSize: (size: number) => void;
  trades: any[];
  formatCurrency: (value: number) => string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
  notes: string | null;
}

export function CapitalManagement({
  portfolioSize,
  setPortfolioSize,
  trades,
  formatCurrency,
}: CapitalManagementProps) {
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDate, setDepositDate] = useState<Date>(new Date());
  const [depositNotes, setDepositNotes] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDate, setWithdrawDate] = useState<Date>(new Date());
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadTransactions = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(20);
    if (!error && data) setTransactions(data as Transaction[]);
  };

  const refreshBalance = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .maybeSingle();
    if (data?.balance !== undefined && data.balance !== null) {
      setPortfolioSize(Number(data.balance));
    }
    await refreshProfile();
  };

  useEffect(() => {
    if (!user) return;
    loadTransactions();

    const channel = supabase
      .channel('transactions-capital')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
        () => {
          loadTransactions();
          refreshBalance();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const submitTransaction = async (type: 'deposit' | 'withdrawal') => {
    if (!user) return;
    const rawAmount = type === 'deposit' ? depositAmount : withdrawAmount;
    const date = type === 'deposit' ? depositDate : withdrawDate;
    const notes = type === 'deposit' ? depositNotes : withdrawNotes;
    const amount = parseFloat(rawAmount);

    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Montant invalide', description: 'Entrez un montant supérieur à 0.', variant: 'destructive' });
      return;
    }
    if (!date) {
      toast({ title: 'Date requise', description: "Sélectionnez la date de l'opération.", variant: 'destructive' });
      return;
    }
    if (type === 'withdrawal' && amount > portfolioSize) {
      toast({ title: 'Solde insuffisant', description: 'Vous ne pouvez pas retirer plus que votre solde.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        type,
        amount,
        date: date.toISOString(),
        notes: notes || null,
      });
      if (error) throw error;

      if (type === 'deposit') {
        setDepositAmount('');
        setDepositNotes('');
        setDepositDate(new Date());
      } else {
        setWithdrawAmount('');
        setWithdrawNotes('');
        setWithdrawDate(new Date());
      }

      toast({
        title: type === 'deposit' ? 'Dépôt enregistré' : 'Retrait enregistré',
        description: `${formatCurrency(amount)} le ${format(date, 'dd/MM/yyyy')}`,
      });
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Erreur', description: err.message || 'Opération échouée.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Transaction supprimée' });
    }
  };

  const totalPnl = trades.reduce((sum, t) => sum + (Number(t.pnl) || 0), 0);
  const perfPct = portfolioSize > 0 ? (totalPnl / portfolioSize) * 100 : 0;

  const DatePicker = ({ value, onChange }: { value: Date; onChange: (d: Date) => void }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP', { locale: fr }) : 'Choisir une date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => d && onChange(d)}
          initialFocus
          className={cn('p-3 pointer-events-auto')}
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gérer le capital</CardTitle>
        <CardDescription>Enregistrez vos dépôts et retraits avec leur date réelle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Dépôt */}
          <div className="rounded-lg border p-4 space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4 text-green-500" /> Déposer des fonds
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Montant (€)"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <DatePicker value={depositDate} onChange={setDepositDate} />
            </div>
            <Textarea
              placeholder="Notes (optionnel)"
              value={depositNotes}
              onChange={(e) => setDepositNotes(e.target.value)}
              rows={2}
            />
            <Button onClick={() => submitTransaction('deposit')} disabled={submitting} className="w-full gap-2">
              <Plus className="h-4 w-4" /> Enregistrer le dépôt
            </Button>
          </div>

          {/* Retrait */}
          <div className="rounded-lg border p-4 space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Minus className="h-4 w-4 text-red-500" /> Retirer des fonds
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Montant (€)"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <DatePicker value={withdrawDate} onChange={setWithdrawDate} />
            </div>
            <Textarea
              placeholder="Notes (optionnel)"
              value={withdrawNotes}
              onChange={(e) => setWithdrawNotes(e.target.value)}
              rows={2}
            />
            <Button
              onClick={() => submitTransaction('withdrawal')}
              disabled={submitting}
              variant="outline"
              className="w-full gap-2"
            >
              <Minus className="h-4 w-4" /> Enregistrer le retrait
            </Button>
          </div>
        </div>

        <div className="pt-2 space-y-4">
          <h3 className="text-lg font-semibold">Statistiques</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DataCard
              title="Solde du portefeuille"
              value={formatCurrency(portfolioSize)}
              icon={<Wallet className="w-4 h-4" />}
            />
            {trades.length > 0 && (
              <DataCard
                title="Performance totale"
                value={`${perfPct.toFixed(2)}%`}
                icon={totalPnl > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                valueClassName={totalPnl > 0 ? 'text-profit' : 'text-loss'}
              />
            )}
          </div>
        </div>

        {transactions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Historique des opérations</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-md border p-3 text-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'font-medium',
                          tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'
                        )}
                      >
                        {tx.type === 'deposit' ? '+' : '-'}
                        {formatCurrency(Number(tx.amount))}
                      </span>
                      <span className="text-muted-foreground">
                        {format(new Date(tx.date), 'dd/MM/yyyy', { locale: fr })}
                      </span>
                    </div>
                    {tx.notes && <p className="text-xs text-muted-foreground mt-1">{tx.notes}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTransaction(tx.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
