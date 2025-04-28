import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Check, Calendar, BarChart3, Clock, AlertCircle, Star, Download, Gift, Zap, MessageSquare, Users } from 'lucide-react';
import { usePremium } from '@/context/PremiumContext';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";

const Premium = () => {
  const { isPremium, premiumExpires } = usePremium();
  const navigate = useNavigate();
  
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  
  const testimonials = [
    {
      text: "Trades Tracker a transformé ma façon d'analyser mes performances. Je peux maintenant identifier facilement mes schémas de trading gagnants.",
      author: "Alexandre D.",
      role: "Day Trader",
      avatar: "/lovable-uploads/6b9faeba-9821-4d33-be9c-6a099aa8c1fe.png",
      rating: 5
    },
    {
      text: "Interface intuitive, statistiques claires. Exactement ce dont j'avais besoin pour progresser et être plus disciplinée dans mes trades.",
      author: "Marie L.",
      role: "Investisseur particulier",
      avatar: "/lovable-uploads/7b5e102a-70c9-4618-a03e-87c1f375227e.png",
      rating: 5
    },
    {
      text: "Le journal de trading est devenu mon meilleur allié. Je comprends mieux mes erreurs et améliore constamment ma stratégie.",
      author: "Thomas B.",
      role: "Swing Trader",
      avatar: "/lovable-uploads/68631625-1d14-4206-b940-611ff6fce57e.png",
      rating: 5
    },
    {
      text: "Après avoir testé plusieurs outils, Trades Tracker est définitivement le plus complet. Les fonctionnalités premium valent vraiment l'investissement.",
      author: "Sophie M.",
      role: "Trader Forex",
      avatar: "/lovable-uploads/75bc79d3-a83c-4eac-88bb-45983d822da6.png",
      rating: 5
    }
  ];
  
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
      <div className="container py-12 max-w-5xl mx-auto space-y-16 page-transition">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Une tarification simple et transparente</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choisissez le forfait qui correspond à vos besoins et boostez votre trading
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center p-1 bg-muted rounded-full">
            <button 
              onClick={() => setSelectedPlan('monthly')} 
              className={`px-4 py-2 text-sm rounded-full transition-all ${selectedPlan === 'monthly' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Mensuel
            </button>
            <button 
              onClick={() => setSelectedPlan('annual')} 
              className={`px-4 py-2 text-sm rounded-full transition-all ${selectedPlan === 'annual' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}
            >
              Annuel <span className="text-xs opacity-80 ml-1">-17%</span>
            </button>
          </div>
        </div>
        
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive mx-auto mb-8 max-w-2xl">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Paiements temporairement désactivés</AlertTitle>
          <AlertDescription>
            Les paiements sont actuellement désactivés jusqu'à la sortie officielle du site. 
            Vous pourrez souscrire à l'abonnement premium très prochainement.
          </AlertDescription>
        </Alert>
              
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          <Card className="border border-border bg-card">
            <CardHeader className="pb-4">
              <div className="mb-2">
                <span className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">Standard</span>
              </div>
              <CardTitle className="text-2xl">Gratuit</CardTitle>
              <CardDescription className="text-base">Pour commencer à suivre vos trades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="pt-4 border-t border-border">
                <h3 className="font-medium mb-3">Inclus :</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <span>Journal de trading illimité</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <span>Suivi de portefeuille</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <span>Statistiques de base</span>
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="h-5 w-5 mr-3 shrink-0" />
                    <span>Calendrier des trades</span>
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="h-5 w-5 mr-3 shrink-0" />
                    <span>Statistiques avancées</span>
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="h-5 w-5 mr-3 shrink-0" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard">Commencer gratuitement</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-2 border-primary bg-card shadow-lg relative">
            <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
              Recommandé
            </div>
            <CardHeader className="pb-4">
              <div className="mb-2">
                <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">Premium</span>
              </div>
              <CardTitle className="text-2xl">
                {selectedPlan === 'monthly' ? '9,99€' : '99,99€'}
                <span className="text-base font-normal text-muted-foreground ml-1">
                  {selectedPlan === 'monthly' ? '/mois' : '/an'}
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                {selectedPlan === 'annual' && <span className="text-sm text-muted-foreground">Soit 8,33€ par mois</span>}
                Améliorez votre trading avec des outils avancés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="pt-4 border-t border-border">
                <h3 className="font-medium mb-3">Tout ce qui est inclus dans Standard, plus :</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Calendrier des trades</span>
                      <p className="text-sm text-muted-foreground">Visualisez vos trades dans le temps</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Statistiques avancées</span>
                      <p className="text-sm text-muted-foreground">Analyses détaillées de vos performances</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Exports illimités</span>
                      <p className="text-sm text-muted-foreground">Exportez toutes vos données facilement</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <div>
                      <span className="font-medium">Support prioritaire</span>
                      <p className="text-sm text-muted-foreground">Accès à notre équipe dédiée</p>
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>Prochainement disponible</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold">Comparaison détaillée</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez en détail toutes les fonctionnalités proposées dans chacun de nos forfaits
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4">Fonctionnalité</th>
                  <th className="text-center p-4">Standard</th>
                  <th className="text-center p-4 bg-primary/5">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-4">Journal de trading</td>
                  <td className="text-center p-4"><Check className="inline h-5 w-5 text-green-500" /></td>
                  <td className="text-center p-4 bg-primary/5"><Check className="inline h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4">Suivi de portefeuille</td>
                  <td className="text-center p-4"><Check className="inline h-5 w-5 text-green-500" /></td>
                  <td className="text-center p-4 bg-primary/5"><Check className="inline h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4">Statistiques de base</td>
                  <td className="text-center p-4"><Check className="inline h-5 w-5 text-green-500" /></td>
                  <td className="text-center p-4 bg-primary/5"><Check className="inline h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4">Calendrier des trades</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4 bg-primary/5"><Check className="inline h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4">Statistiques avancées</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4 bg-primary/5"><Check className="inline h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4">Analyse de drawdown</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4 bg-primary/5"><Check className="inline h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4">Comparaison avec indices</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4 bg-primary/5"><Check className="inline h-5 w-5 text-green-500" /></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4">Exports de données</td>
                  <td className="text-center p-4">Limité</td>
                  <td className="text-center p-4 bg-primary/5">Illimité</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-4">Support client</td>
                  <td className="text-center p-4">Email</td>
                  <td className="text-center p-4 bg-primary/5">Email + Chat prioritaire</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
          
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Questions fréquentes</h2>
            <p className="text-muted-foreground">Tout ce que vous devez savoir sur nos abonnements</p>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Puis-je changer de forfait à tout moment ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Oui, vous pouvez passer du forfait Standard à Premium à tout moment. Si vous passez de l'abonnement mensuel à l'abonnement annuel, nous vous créditerons le temps restant de votre abonnement mensuel.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Comment fonctionne la période d'essai ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Pendant la phase bêta, tous les utilisateurs ont accès à toutes les fonctionnalités premium gratuitement. Une fois la phase bêta terminée, vous pourrez choisir de continuer avec le forfait Premium ou revenir au forfait Standard.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Quels moyens de paiement acceptez-vous ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Nous acceptons les cartes de crédit (Visa, Mastercard, American Express) et PayPal. Les paiements sont sécurisés et chiffrés.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Ce que nos utilisateurs disent</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment Trades Tracker aide les traders à améliorer leurs performances
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex text-primary">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto bg-muted/50 rounded-lg p-8 border border-border">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Encore des questions ?</h2>
            <p className="text-muted-foreground">Notre équipe est là pour vous aider dans votre choix</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex gap-2">
              <MessageSquare className="h-4 w-4" />
              Discuter avec un conseiller
            </Button>
            <Button className="flex gap-2" asChild>
              <Link to="/contact">
                <Users className="h-4 w-4" />
                Contacter l'équipe
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Premium;
