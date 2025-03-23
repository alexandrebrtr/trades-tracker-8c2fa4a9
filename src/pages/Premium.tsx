
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Calendar, BarChart3, ArrowRight, Zap } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isPremium, setPremiumStatus } = usePremium();
  
  // Redirect to payment page
  const handleSubscribe = () => {
    if (selectedPlan === 'yearly') {
      // Navigate to payment page with yearly plan selected
      navigate('/payment?plan=yearly');
    } else {
      // Navigate to payment page with monthly plan selected
      navigate('/payment?plan=monthly');
    }
  };

  // For demo purposes only - allow instant premium activation
  const handleDemoActivate = async () => {
    try {
      await setPremiumStatus(true);
      toast({
        title: "Premium activé",
        description: "Vous avez maintenant accès à toutes les fonctionnalités premium"
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error activating premium:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer le mode premium",
        variant: "destructive"
      });
    }
  };

  // If user is already premium, show different content
  if (isPremium) {
    return (
      <AppLayout>
        <div className="page-transition space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Abonnement Premium</h1>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-primary/10 text-primary rounded-full px-4 py-1 inline-flex items-center gap-1 mb-6">
              <Star className="h-4 w-4 fill-primary" />
              <span className="text-sm font-medium">Abonnement Actif</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Vous êtes déjà abonné à Premium !</h2>
            <p className="text-muted-foreground mb-8">
              Profitez de toutes les fonctionnalités premium de Trades Tracker pour améliorer votre expérience de trading.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Retour au tableau de bord
              </Button>
              <Button onClick={() => navigate('/calendar')}>
                <Calendar className="h-4 w-4 mr-2" />
                Accéder au Calendrier
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Abonnement Premium</h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">Déverrouillez toutes les fonctionnalités</h2>
            <p className="text-muted-foreground mt-2">
              Améliorez votre expérience de trading avec notre abonnement premium
            </p>
          </div>

          <Tabs defaultValue="monthly" className="mb-8" onValueChange={(value) => setSelectedPlan(value as 'monthly' | 'yearly')}>
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                <TabsTrigger value="yearly">
                  Annuel
                  <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                    -17%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="monthly" className="mt-6">
              <Card className="border-2 border-primary/50">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-2">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  </div>
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <div className="mt-1">
                    <span className="text-3xl font-bold">9,99€</span>
                    <span className="text-muted-foreground"> /mois</span>
                  </div>
                  <CardDescription className="mt-1.5">
                    Tout ce dont vous avez besoin pour améliorer votre trading
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Accès au calendrier de trading</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Personnalisation avancée du profil</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Statistiques avancées et analyses de performance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Rapports détaillés et exportations illimitées</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Fonctionnalités sociales et communauté</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Support prioritaire</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button className="w-full" size="lg" onClick={handleSubscribe}>
                    S'abonner maintenant
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDemoActivate} className="text-xs">
                    Activer Premium (Démo)
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="yearly" className="mt-6">
              <Card className="border-2 border-primary/50">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-2">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  </div>
                  <CardTitle className="text-2xl">Premium Annuel</CardTitle>
                  <div className="mt-1">
                    <span className="text-3xl font-bold">99,99€</span>
                    <span className="text-muted-foreground"> /an</span>
                  </div>
                  <CardDescription className="mt-1.5">
                    <span className="text-sm line-through text-muted-foreground">119,88€</span>
                    <span className="text-green-500 font-semibold ml-2">Économisez 17%</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Accès au calendrier de trading</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Personnalisation avancée du profil</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Statistiques avancées et analyses de performance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Tous les avantages du plan mensuel</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Économisez 17% par rapport au plan mensuel</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Webinaires exclusifs et contenu premium</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button className="w-full" size="lg" onClick={handleSubscribe}>
                    S'abonner annuellement
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDemoActivate} className="text-xs">
                    Activer Premium (Démo)
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 space-y-8">
            <h3 className="text-xl font-bold text-center">Fonctionnalités Premium</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Calendrier de Trading</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visualisez vos trades sur un calendrier interactif et planifiez vos activités de trading à l'avance.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/premium')}>
                    Débloquer <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Analyses Avancées</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Accédez à des analyses détaillées de vos performances, des graphiques avancés et des métriques personnalisées.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/premium')}>
                    Débloquer <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Fonctionnalités Sociales</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connectez-vous avec d'autres traders, partagez vos analyses et apprenez des meilleurs.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/premium')}>
                    Débloquer <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Thèmes Personnalisés</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Personnalisez l'apparence de l'application avec des thèmes exclusifs et des options de couleur avancées.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/premium')}>
                    Débloquer <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-10">
            <p>Sans engagement. Annulez à tout moment.</p>
            <p className="mt-1">
              En vous abonnant, vous acceptez nos{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                conditions d'utilisation
              </a>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
