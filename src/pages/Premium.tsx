import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Shield, ArrowRight, Calendar, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isPremium, setPremiumStatus } = usePremium();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Function to handle subscription purchase
  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour vous abonner.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Display the "not available" message
    toast({
      title: "Fonctionnalité non disponible",
      description: "Cette fonctionnalité n'est pas disponible pour le moment.",
      variant: "default",
      duration: 5000
    });
    
    // Optional: You can add an icon to the toast
    // Uncomment if you want to use it
    /*
    toast({
      title: "Fonctionnalité non disponible",
      description: "Cette fonctionnalité n'est pas disponible pour le moment.",
      variant: "default",
      duration: 5000,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
    });
    */
  };

  // If user already has premium, redirect to premium dashboard
  if (isPremium) {
    navigate('/premium-dashboard');
    return null;
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
                      <span>Accès à la communauté de traders</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Statistiques avancées et analyses de performance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Accès au calendrier économique personnalisé</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Rapports détaillés et exportations illimitées</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Intégrations API complètes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Thèmes et personnalisation avancée</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Support prioritaire</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Traitement en cours..." : "S'abonner maintenant"}
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
                <CardFooter>
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Traitement en cours..." : "S'abonner annuellement"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="space-y-8 mt-12">
            <h3 className="text-xl font-bold text-center">Découvrez nos fonctionnalités premium</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Feature cards with better integration to site features */}
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    Calendrier économique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Suivez les événements économiques importants et organisez vos trades en conséquence.
                  </p>
                  <Link 
                    to="/calendar" 
                    className="text-primary text-sm font-medium flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: "Fonctionnalité Premium",
                        description: "Abonnez-vous pour accéder au calendrier économique",
                      });
                    }}
                  >
                    Voir un aperçu <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    Analyses avancées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Obtenez des analyses détaillées de vos performances avec des métriques professionnelles.
                  </p>
                  <Link 
                    to="/premium-analytics" 
                    className="text-primary text-sm font-medium flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: "Fonctionnalité Premium",
                        description: "Abonnez-vous pour accéder aux analyses avancées",
                      });
                    }}
                  >
                    Voir un aperçu <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-muted/40 border-primary/20">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">Prêt à améliorer votre expérience de trading?</h3>
                    <p className="text-muted-foreground mt-1">Rejoignez notre communauté de traders premium aujourd'hui.</p>
                  </div>
                  <Button onClick={handleSubscribe}>
                    Commencer maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-8">
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
