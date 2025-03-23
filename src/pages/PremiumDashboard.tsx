
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { usePremium } from '@/context/PremiumContext';
import { Calendar, ChartBar, FileText, MessageCircle, Settings, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PremiumDashboard() {
  const { toast } = useToast();
  const { premiumExpires } = usePremium();
  
  // Format premium expiration date
  const formatExpiryDate = () => {
    if (!premiumExpires) return "Non disponible";
    
    const date = new Date(premiumExpires);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Espace Premium</h1>
            <p className="text-muted-foreground mt-1">Bienvenue dans votre espace premium</p>
          </div>
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30 flex items-center gap-1.5 px-3 py-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-500" />
            Abonnement actif jusqu'au {formatExpiryDate()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Calendrier
              </CardTitle>
              <CardDescription>Calendrier économique personnalisé</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Suivez les événements économiques importants et planifiez vos trades en conséquence.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/calendar">Accéder au calendrier</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="h-5 w-5 text-primary" />
                Analyses Avancées
              </CardTitle>
              <CardDescription>Statistiques et métriques détaillées</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Accédez à des analyses approfondies et des visualisations de vos performances.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/premium-analytics">Voir les analyses</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Rapports
              </CardTitle>
              <CardDescription>Exportations et rapports personnalisés</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Générez des rapports détaillés sur vos performances et exportez vos données.
              </p>
              <Button variant="outline" className="w-full">
                Générer un rapport
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Personnalisation
              </CardTitle>
              <CardDescription>Options de personnalisation avancées</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Personnalisez l'interface selon vos préférences et votre style de trading.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/settings">Paramètres</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Support Premium
              </CardTitle>
              <CardDescription>Assistance prioritaire</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Bénéficiez d'une assistance prioritaire pour toutes vos questions.
              </p>
              <Button variant="outline" className="w-full">
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
