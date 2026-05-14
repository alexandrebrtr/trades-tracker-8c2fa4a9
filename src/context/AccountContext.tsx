import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export type AccountType = 'demo' | 'live' | 'paper' | 'prop_firm';
export type PropFirmStatus = 'evaluation' | 'funded' | 'failed' | 'passed';

export interface TradingAccount {
  id: string;
  user_id: string;
  name: string;
  broker: string | null;
  currency: string;
  account_type: AccountType;
  initial_capital: number;
  leverage: number;
  profit_target: number | null;
  max_drawdown: number | null;
  daily_drawdown: number | null;
  prop_firm_status: PropFirmStatus | null;
  archived: boolean;
  is_default: boolean;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface AccountContextValue {
  accounts: TradingAccount[];
  activeAccount: TradingAccount | null;
  activeAccountId: string | null;
  setActiveAccountId: (id: string | null) => void;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

const storageKey = (uid: string) => `activeAccountId:${uid}`;

export function AccountProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [activeAccountId, setActiveAccountIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setActiveAccountId = useCallback((id: string | null) => {
    setActiveAccountIdState(id);
    if (user && id) localStorage.setItem(storageKey(user.id), id);
  }, [user]);

  const fetchAccounts = useCallback(async () => {
    if (!user) {
      setAccounts([]);
      setActiveAccountIdState(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('trading_accounts' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('archived', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) {
      console.error('AccountContext fetch error', error);
      setAccounts([]);
      setLoading(false);
      return;
    }
    let list = (data || []) as unknown as TradingAccount[];

    // Auto-create default account if user has none
    if (list.length === 0) {
      const { data: created } = await supabase
        .from('trading_accounts' as any)
        .insert({
          user_id: user.id,
          name: 'Compte principal',
          account_type: 'live',
          currency: 'EUR',
          initial_capital: 0,
          is_default: true,
        } as any)
        .select()
        .single();
      if (created) list = [created as unknown as TradingAccount];
    }

    setAccounts(list);

    const stored = localStorage.getItem(storageKey(user.id));
    const valid = list.find(a => a.id === stored && !a.archived);
    const fallback = list.find(a => !a.archived) || list[0] || null;
    const activeId = valid?.id ?? fallback?.id ?? null;
    setActiveAccountIdState(activeId);
    if (activeId) localStorage.setItem(storageKey(user.id), activeId);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  // Realtime sync
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel('trading-accounts-' + user.id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trading_accounts', filter: `user_id=eq.${user.id}` }, () => {
        fetchAccounts();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, fetchAccounts]);

  const activeAccount = accounts.find(a => a.id === activeAccountId) || null;

  return (
    <AccountContext.Provider value={{ accounts, activeAccount, activeAccountId, setActiveAccountId, loading, refresh: fetchAccounts }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
