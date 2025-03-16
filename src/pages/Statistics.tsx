
import { AppLayout } from '@/components/layout/AppLayout';
import AnalyticsView from '@/components/statistics/AnalyticsView';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Wallet, Star, ArrowRight } from 'lucide-react';
import { usePremium } from '@/context/PremiumContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Statistics = () => {
  const { isPremium } = usePremium();
  
  return (
    <AppLayout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Statistiques & Analyse</h1>
          </div>
          <div className="flex gap-4">
            {isPremium && (
              <Button asChild>
                <Link to="/premium-analytics" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Analyses Premium</span>
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/portfolio" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>Gérer le portefeuille</span>
              </Link>
            </Button>
          </div>
        </div>
        
        {!isPremium && (
          <Card className="mb-6 border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-yellow-600">
                <Star className="h-5 w-5 inline-block mr-2 fill-yellow-500" />
                Débloquez les analyses avancées avec Premium
              </CardTitle>
              <CardDescription>
                Accédez à des métriques avancées, des analyses de séquences, des rapports détaillés et bien plus encore.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>Analyse du ratio risque/récompense</li>
                  <li>Corrélation avec le marché</li>
                  <li>Rapport d'analyse personnalisé</li>
                  <li>Métriques avancées (Sharpe, Sortino, etc.)</li>
                </ul>
              </div>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Link to="/premium" className="flex items-center gap-1">
                  <span>Passer à Premium</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
        
        <AnalyticsView />
      </div>
    </AppLayout>
  );
};

export default Statistics;
