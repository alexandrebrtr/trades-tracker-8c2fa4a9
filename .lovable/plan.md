
# Système multi-comptes de trading

Refonte profonde de l'app pour passer d'un modèle "1 utilisateur = 1 portefeuille" à "1 utilisateur = N comptes indépendants", chaque compte ayant ses propres trades, transactions, balance, statistiques et analyses.

## 1. Schéma base de données

Nouvelle table `trading_accounts` :
- `id`, `user_id`, `created_at`, `updated_at`
- `name` (texte), `broker` (texte), `currency` (EUR/USD/GBP)
- `account_type` : enum `demo` | `live` | `paper` | `prop_firm`
- `initial_capital` (numeric), `leverage` (numeric, défaut 1)
- `profit_target` (numeric, nullable), `max_drawdown` (numeric %), `daily_drawdown` (numeric %)
- `prop_firm_status` : enum `evaluation` | `funded` | `failed` | `passed` (nullable)
- `archived` (bool), `is_default` (bool)
- `balance` (numeric, recalculée par triggers)

Modifications tables existantes :
- `trades` : ajout colonne `account_id uuid` (FK logique vers `trading_accounts`)
- `transactions` : ajout colonne `account_id uuid`
- `calendar_events` : ajout colonne `account_id uuid` (optionnel, scopé par compte)
- `custom_charts` : ajout colonne `account_id uuid`

Migration de l'existant :
- Pour chaque user ayant déjà des trades/transactions, créer un compte par défaut "Mon compte principal" (type `live`, devise EUR) et associer toutes les données existantes à ce compte.

Fonctions/triggers :
- Adapter `recalculate_user_balance` → `recalculate_account_balance(_account_id uuid)` qui calcule depuis transactions+trades filtrés par `account_id` et met à jour `trading_accounts.balance`.
- Adapter les triggers `handle_transaction_change` et `handle_trade_balance_change` pour utiliser `account_id`.
- Conserver le solde profil global = somme des comptes non archivés (compatibilité legacy).

RLS : politiques classiques `auth.uid() = user_id` sur `trading_accounts`. Les politiques existantes sur trades/transactions restent valides puisque `user_id` reste présent.

## 2. État global compte actif

Nouveau `AccountContext` (`src/context/AccountContext.tsx`) :
- Liste tous les comptes non archivés de l'utilisateur
- Expose `activeAccountId`, `setActiveAccountId`, `accounts`, `activeAccount`, `refresh()`
- Persiste l'`activeAccountId` dans `localStorage` (par user)
- Realtime sur `trading_accounts` pour rafraîchir la liste/balances
- Wrapper dans `App.tsx` au-dessus des routes authentifiées

## 3. Filtrage systématique par account_id

Adapter tous les fetchers et services pour filtrer par `activeAccountId` :
- `useTradesFetcher`, `DashboardData.fetchUserData`
- `Portfolio.tsx` (capital, transactions, allocations)
- `Statistics.tsx` + `AdvancedAnalyticsHub` (Monte Carlo, ratios, Greeks, patterns)
- `Calendar.tsx` + `TradeCalendar` + `DayDetailView`
- `Journal.tsx`
- `TradeForm.tsx` (insère avec `account_id = activeAccountId`)
- `ImportTradesDialog.tsx` (CSV + image)
- `CapitalManagement.tsx` (dépôts/retraits sur le compte actif)

Toutes les requêtes Supabase ajoutent `.eq('account_id', activeAccountId)`.

## 4. UI – Création et gestion des comptes

Nouvelle page `src/pages/Accounts.tsx` (`/accounts`) :
- Grille de cartes par compte (nom, broker, type badge, devise, balance, PnL total, win rate, drawdown actuel)
- Boutons : Sélectionner / Modifier / Archiver
- Bouton "Nouveau compte" → dialog `AccountForm` :
  - Nom, broker, devise (EUR/USD/GBP), type (demo/live/paper/prop_firm)
  - Capital initial, levier (slider 1–500)
  - Objectif de profit (%), drawdown max (%), daily drawdown (%)
  - Si prop_firm → statut initial (evaluation par défaut)

## 5. Sélecteur dans la navbar

Ajout dans `Header.tsx` (à côté du HeaderBalance) d'un `AccountSwitcher` :
- Dropdown listant les comptes avec balance et badge type
- Item "Gérer les comptes…" → `/accounts`
- Indicateur visuel du type (couleur : demo gris, live vert, paper bleu, prop_firm violet)

## 6. Widget Prop Firm

Composant `PropFirmTracker` affiché sur Dashboard et Statistiques **uniquement quand `activeAccount.account_type === 'prop_firm'`** :
- Progression vers objectif de profit (barre)
- Drawdown actuel vs max (barre + alerte rouge si > 80%)
- Daily drawdown du jour (calculé sur les trades de la journée)
- Indicateur "Règles respectées" / "Violation détectée"
- Badge statut : En évaluation / Funded / Failed / Passed
- Si violation drawdown détectée → toast + suggestion de passer le statut à Failed

## 7. Détails techniques

```text
AccountContext
  └─> filtre toutes les requêtes via activeAccountId
       ├─> Dashboard / Stats / Calendar / Journal / Portfolio
       └─> TradeForm / Import / CapitalManagement insèrent avec account_id

Triggers DB
  trade insert/update/delete ──► recalculate_account_balance(account_id)
  transaction insert/update/delete ──► recalculate_account_balance(account_id)
```

Calcul drawdown prop firm (côté client) :
- equity curve = initial_capital + cumul(pnl) + cumul(transactions)
- drawdown courant = (peak - current) / peak * 100
- daily drawdown = pnl du jour / balance début de journée * 100

## 8. Fichiers principaux

Créés :
- `supabase/migrations/...` (table + colonnes + triggers + migration des données)
- `src/context/AccountContext.tsx`
- `src/pages/Accounts.tsx`
- `src/components/accounts/AccountCard.tsx`
- `src/components/accounts/AccountForm.tsx`
- `src/components/accounts/AccountSwitcher.tsx`
- `src/components/accounts/PropFirmTracker.tsx`
- `src/hooks/useActiveAccount.ts`

Modifiés :
- `src/App.tsx` (provider + route)
- `src/components/navigation/Header.tsx` + `Sidebar.tsx`
- `src/hooks/useTradesFetcher.ts`
- `src/services/DashboardData.ts`
- `src/pages/Dashboard.tsx`, `Portfolio.tsx`, `Statistics.tsx`, `Calendar.tsx`, `Journal.tsx`
- `src/components/forms/TradeForm.tsx`, `ImportTradesDialog.tsx`
- `src/components/portfolio/CapitalManagement.tsx`
- `src/components/statistics/AdvancedAnalyticsHub.tsx` (+ ses sous-composants reçoivent les trades déjà filtrés, donc peu de changement)

## 9. Ordre d'implémentation

1. Migration DB + données existantes migrées vers compte par défaut
2. `AccountContext` + `AccountSwitcher` dans la navbar
3. Page `/accounts` (CRUD + archive)
4. Refactor des fetchers pour filtrer par `account_id`
5. Insertions (TradeForm, transactions, import) avec `account_id`
6. Widget `PropFirmTracker` conditionnel
7. Tests visuels sur chaque page après changement de compte

Travail conséquent (~15–20 fichiers touchés) mais sans casser les données existantes.
