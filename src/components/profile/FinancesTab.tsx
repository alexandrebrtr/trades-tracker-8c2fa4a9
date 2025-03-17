
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FinancesTabProps {
  balance: string;
  tradesCount: number;
}

export function FinancesTab({ balance, tradesCount }: FinancesTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2 md:col-span-1">
        <CardHeader>
          <CardTitle>Performances des trades</CardTitle>
          <CardDescription>
            Récapitulatif de vos performances de trading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/70 p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground">Trades totaux</h3>
                <p className="text-2xl font-bold mt-1">{tradesCount || 0}</p>
              </div>
              <div className="bg-card/70 p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground">Win Rate</h3>
                <p className="text-2xl font-bold mt-1 text-green-500">68%</p>
              </div>
              <div className="bg-card/70 p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground">Profit moyen</h3>
                <p className="text-2xl font-bold mt-1 text-green-500">+42€</p>
              </div>
              <div className="bg-card/70 p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground">Perte moyenne</h3>
                <p className="text-2xl font-bold mt-1 text-red-500">-18€</p>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild className="w-full">
                <Link to="/statistics">Voir toutes les statistiques</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-1">
        <CardHeader>
          <CardTitle>Portefeuille</CardTitle>
          <CardDescription>
            État actuel de votre portefeuille
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-card/70 p-4 rounded-lg border">
              <h3 className="text-sm font-medium text-muted-foreground">Solde total</h3>
              <p className="text-3xl font-bold mt-1">{parseFloat(balance).toLocaleString('fr-FR')} €</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Répartition des actifs</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Actions</span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Crypto</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Liquidités</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild className="w-full">
                <Link to="/portfolio">Gérer le portefeuille</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
