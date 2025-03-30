
import React from 'react';

interface Trade {
  id: string;
  date: Date | string;
  symbol: string;
  type: string;
  entry_price: number;
  exit_price: number;
  size: number;
  pnl: number;
}

interface RecentTradesTableProps {
  trades: Trade[];
}

export function RecentTradesTable({ trades = [] }: RecentTradesTableProps) {
  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold mb-4">Trades récents</h3>
      {(!trades || trades.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun trade enregistré. Commencez à ajouter vos trades dans la section "Ajouter un trade".</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground text-sm">Date</th>
                <th className="pb-2 font-medium text-muted-foreground text-sm">Actif</th>
                <th className="pb-2 font-medium text-muted-foreground text-sm">Type</th>
                <th className="pb-2 font-medium text-muted-foreground text-sm">Prix d'entrée</th>
                <th className="pb-2 font-medium text-muted-foreground text-sm">Prix de sortie</th>
                <th className="pb-2 font-medium text-muted-foreground text-sm">Taille</th>
                <th className="pb-2 font-medium text-muted-foreground text-sm">P&L</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                  <td className="py-3 text-sm">
                    {new Date(trade.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 text-sm font-medium">{trade.symbol}</td>
                  <td className="py-3 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      trade.type === 'long' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'
                    }`}>
                      {trade.type === 'long' ? 'Long' : 'Short'}
                    </span>
                  </td>
                  <td className="py-3 text-sm">{trade.entry_price}</td>
                  <td className="py-3 text-sm">{trade.exit_price}</td>
                  <td className="py-3 text-sm">{trade.size}</td>
                  <td className={`py-3 text-sm font-semibold ${
                    trade.pnl > 0 ? 'text-profit' : trade.pnl < 0 ? 'text-loss' : ''
                  }`}>
                    {trade.pnl > 0 ? '+' : ''}{trade.pnl} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
