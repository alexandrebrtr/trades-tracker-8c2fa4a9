import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Check, ChevronsUpDown, Plus, Settings as SettingsIcon } from 'lucide-react';
import { useAccount, AccountType } from '@/context/AccountContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AccountForm } from './AccountForm';

const TYPE_LABEL: Record<AccountType, string> = {
  demo: 'Démo', live: 'Live', paper: 'Paper', prop_firm: 'Prop Firm'
};
const TYPE_COLOR: Record<AccountType, string> = {
  demo: 'bg-muted text-muted-foreground',
  live: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  paper: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  prop_firm: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
};

export function AccountSwitcher() {
  const { accounts, activeAccount, setActiveAccountId } = useAccount();
  const [createOpen, setCreateOpen] = useState(false);
  const visibleAccounts = accounts.filter(a => !a.archived);

  if (!activeAccount) return null;

  const fmt = (v: number, ccy: string) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: ccy }).format(v);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2 max-w-[220px]">
            <Briefcase className="h-3.5 w-3.5" />
            <span className="truncate font-medium">{activeAccount.name}</span>
            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${TYPE_COLOR[activeAccount.account_type]}`}>
              {TYPE_LABEL[activeAccount.account_type]}
            </Badge>
            <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Comptes de trading</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {visibleAccounts.map(a => (
            <DropdownMenuItem key={a.id} onClick={() => setActiveAccountId(a.id)} className="flex items-start gap-2 cursor-pointer">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{a.name}</span>
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${TYPE_COLOR[a.account_type]}`}>
                    {TYPE_LABEL[a.account_type]}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  {a.broker && <span>{a.broker}</span>}
                  <span className="font-medium text-foreground">{fmt(Number(a.balance), a.currency)}</span>
                </div>
              </div>
              {a.id === activeAccount.id && <Check className="h-4 w-4 text-primary mt-1" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCreateOpen(true)} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" /> Nouveau compte
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/accounts" className="cursor-pointer flex items-center w-full">
              <SettingsIcon className="h-4 w-4 mr-2" /> Gérer les comptes
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AccountForm open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
