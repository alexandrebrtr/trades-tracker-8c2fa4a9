import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Plus, Archive } from 'lucide-react';
import { useAccount, TradingAccount } from '@/context/AccountContext';
import { AccountCard } from '@/components/accounts/AccountCard';
import { AccountForm } from '@/components/accounts/AccountForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function Accounts() {
  const { accounts, activeAccountId, setActiveAccountId, refresh, loading } = useAccount();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TradingAccount | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();

  const visible = accounts.filter(a => showArchived || !a.archived);

  const archive = async (a: TradingAccount) => {
    const newState = !a.archived;
    const { error } = await supabase.from('trading_accounts' as any).update({ archived: newState } as any).eq('id', a.id);
    if (error) toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    else { toast({ title: newState ? 'Compte archivé' : 'Compte restauré' }); refresh(); }
  };

  return (
    <AppLayout>
      <div className="page-transition space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Comptes de trading</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez plusieurs comptes (Démo, Live, Paper, Prop Firm). Chaque compte a ses propres trades, balance et statistiques.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowArchived(s => !s)}>
              <Archive className="h-4 w-4 mr-2" />
              {showArchived ? 'Masquer archivés' : 'Voir archivés'}
            </Button>
            <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Nouveau compte
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map(a => (
              <AccountCard
                key={a.id}
                account={a}
                active={a.id === activeAccountId}
                onSelect={() => setActiveAccountId(a.id)}
                onEdit={() => { setEditing(a); setFormOpen(true); }}
                onArchive={() => archive(a)}
              />
            ))}
          </div>
        )}

        <AccountForm open={formOpen} onOpenChange={setFormOpen} account={editing} />
      </div>
    </AppLayout>
  );
}
