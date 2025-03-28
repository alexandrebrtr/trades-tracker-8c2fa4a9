
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Check, Calendar, BarChart3, Clock, AlertCircle } from 'lucide-react';
import { usePremium } from '@/context/PremiumContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Premium = () => {
  const { isPremium } = usePremium();
  
  return (
    <AppLayout>
      <div className="container py-8 max-w-4xl mx-auto page-transition">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Passez au Premium</h1>
            <p className="text-muted-foreground mt-2">
              Décuplez vos performances avec nos fonctionnalités premium
            </p>
          </div>
          
          {isPremium ? (
            <Card>
              <CardHeader>
                <CardTitle>Vous êtes déjà Premium !</CardTitle>
                <CardDescription>
                  Vous avez déjà accès à toutes les fonctionnalités premium de Trades Tracker.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to="/dashboard">Retour au tableau de bord</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Paiements temporairement désactivés</AlertTitle>
                <AlertDescription>
                  Les paiements sont actuellement désactivés jusqu'à la sortie officielle du site. 
                  Vous pourrez souscrire à l'abonnement premium très prochainement.
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Standard</CardTitle>
                    <CardDescription>Gratuit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span>Journal de trading</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span>Suivi de portefeuille</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span>Statistiques de base</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">Calendrier des trades</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">Statistiques avancées</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-primary bg-primary/5">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Plan Premium</CardTitle>
                        <CardDescription>À partir de 9,99€ par mois</CardDescription>
                      </div>
                      <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        Recommandé
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span>Journal de trading</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span>Suivi de portefeuille</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span>Statistiques de base</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <Calendar className="h-4 w-4 mr-1 text-primary" />
                        <span className="font-medium">Calendrier des trades</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <BarChart3 className="h-4 w-4 mr-1 text-primary" />
                        <span className="font-medium">Statistiques avancées</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <Clock className="h-4 w-4 mr-1 text-primary" />
                        <span className="font-medium">Support prioritaire</span>
                      </li>
                    </ul>
                    
                    <Button disabled className="w-full mt-6">
                      Prochainement disponible
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <CardTitle>Calendrier des Trades</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Visualisez tous vos trades sur un calendrier interactif pour mieux comprendre vos patterns de trading temporels.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <CardTitle>Analyses Avancées</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Accédez à des analyses poussées de vos performances avec des métriques professionnelles et des outils de visualisation avancés.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <CardTitle>Support Prioritaire</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Bénéficiez d'un support technique prioritaire et personnalisé pour vous aider à tirer le meilleur parti de Trades Tracker.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Premium;
