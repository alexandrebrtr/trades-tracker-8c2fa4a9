import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Check, Calendar, BarChart3, Clock, AlertCircle, Star, Download, Gift, Zap } from 'lucide-react';
import { usePremium } from '@/context/PremiumContext';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Premium = () => {
  const { isPremium, premiumExpires } = usePremium();
  const navigate = useNavigate();
  
  if (isPremium) {
    const expiryDate = premiumExpires ? new Date(premiumExpires) : null;
    const formattedExpiryDate = expiryDate ? expiryDate.toLocaleDateString('fr-FR') : 'Date inconnue';
    
    return (
      <AppLayout>
        <div className="container py-8 max-w-4xl mx-auto page-transition">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Votre Abonnement Premium</h1>
              <p className="text-muted-foreground mt-2">
                Merci pour votre confiance ! Vous bénéficiez actuellement de toutes les fonctionnalités premium.
              </p>
            </div>
            
            <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      Compte Premium Actif
                    </CardTitle>
                    <CardDescription>
                      Votre abonnement est valide jusqu'au {formattedExpiryDate}
                    </CardDescription>
                  </div>
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Actif
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white dark:bg-background shadow-sm">
                    <CardContent className="p-6 text-center">
                      <Zap className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                      <h3 className="font-medium mb-2">Analyses Avancées</h3>
                      <p className="text-sm text-muted-foreground">Accès à toutes les analyses premium</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-background shadow-sm">
                    <CardContent className="p-6 text-center">
                      <Download className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                      <h3 className="font-medium mb-2">Exports Illimités</h3>
                      <p className="text-sm text-muted-foreground">Exportez vos données sans limitation</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-background shadow-sm">
                    <CardContent className="p-6 text-center">
                      <Gift className="h-8 w-8 mx-auto mb-4 text-blue-500" />
                      <h3 className="font-medium mb-2">Fonctionnalités Exclusives</h3>
                      <p className="text-sm text-muted-foreground">Accès aux futures fonctionnalités</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white dark:bg-background p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-medium">Gérer votre abonnement</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate('/statistics')}
                    >
                      Accéder aux statistiques avancées
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => navigate('/profile')}
                    >
                      Voir mon profil
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-white/50 dark:bg-background/50 flex flex-col sm:flex-row items-center gap-4 justify-between rounded-b-lg">
                <p className="text-sm text-muted-foreground">
                  Pour toute question concernant votre abonnement, contactez notre support.
                </p>
                <Button variant="outline" size="sm">
                  Contacter le support
                </Button>
              </CardFooter>
            </Card>
            
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Avantages Premium dont vous bénéficiez</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mesures de performance avancées</h3>
                      <p className="text-sm text-muted-foreground">Suivez vos performances avec des indicateurs professionnels</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Analyse de risque détaillée</h3>
                      <p className="text-sm text-muted-foreground">Obtenez des insights sur votre exposition au risque</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Recommandations personnalisées</h3>
                      <p className="text-sm text-muted-foreground">Recevez des conseils adaptés à votre profil</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Analyse détaillée des patterns</h3>
                      <p className="text-sm text-muted-foreground">Identifiez les patterns qui fonctionnent pour vous</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Comparaison avec les indices</h3>
                      <p className="text-sm text-muted-foreground">Comparez vos performances avec les principaux indices</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Support prioritaire</h3>
                      <p className="text-sm text-muted-foreground">Accédez à un support technique dédié</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

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
