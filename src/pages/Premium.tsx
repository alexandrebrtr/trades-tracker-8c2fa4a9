
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePremium } from '@/context/PremiumContext';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChartBarIcon, CheckIcon, Clock, LockIcon, LucideIcon, Star, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PlanFeatureProps {
  available: boolean;
  title: string;
}

const PlanFeature = ({ available, title }: PlanFeatureProps) => (
  <div className="flex items-center gap-2">
    {available ? (
      <CheckIcon className="h-4 w-4 text-primary" />
    ) : (
      <Clock className="h-4 w-4 text-muted-foreground" />
    )}
    <span className={available ? 'text-foreground' : 'text-muted-foreground'}>{title}</span>
  </div>
);

interface PlanProps {
  title: string;
  price: string;
  regularPrice?: string;
  period: string;
  description: string;
  features: { available: boolean; title: string }[];
  recommended?: boolean;
  discount?: string;
  onSelect: () => void;
}

const PricingPlan = ({
  title,
  price,
  regularPrice,
  period,
  description,
  features,
  recommended = false,
  discount,
  onSelect
}: PlanProps) => {
  return (
    <Card className={`relative h-full ${recommended ? 'border-primary shadow-lg' : ''}`}>
      {recommended && (
        <Badge className="absolute -top-2 right-6 bg-primary hover:bg-primary/90">
          Recommandé
        </Badge>
      )}
      {discount && (
        <Badge variant="outline" className="absolute -top-2 left-6 bg-green-500/10 text-green-500 border-green-500/30">
          Économisez {discount}
        </Badge>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-end">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-muted-foreground ml-1 mb-1">/{period}</span>
          </div>
          {regularPrice && (
            <div className="text-sm text-muted-foreground line-through mt-1">{regularPrice}</div>
          )}
        </div>

        <div className="space-y-2">
          {features.map((feature, index) => (
            <PlanFeature key={index} available={feature.available} title={feature.title} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSelect} className="w-full" variant={recommended ? "default" : "outline"}>
          {recommended ? 'Sélectionner' : 'Choisir ce plan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <Card className="h-full">
    <CardHeader>
      <Icon className="h-8 w-8 text-primary mb-2" />
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function Premium() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { isPremium } = usePremium();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers le dashboard premium si l'utilisateur est déjà abonné
  if (isPremium) {
    navigate('/premium-dashboard');
    return null;
  }

  const handleSelectPlan = () => {
    toast.error("Fonctionnalité non disponible pour le moment", {
      description: "Le système de paiement est en cours de développement."
    });
  };

  const monthlyFeatures = [
    { available: true, title: 'Accès au calendrier économique' },
    { available: true, title: 'Analyses avancées de performance' },
    { available: true, title: 'Rapports détaillés personnalisés' },
    { available: true, title: 'Support prioritaire' },
    { available: true, title: 'Personnalisation avancée' },
  ];

  const yearlyFeatures = [
    ...monthlyFeatures,
    { available: true, title: 'Données historiques étendues' },
    { available: true, title: 'Outils d\'optimisation de portefeuille' }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto py-10 space-y-16">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 mb-4">
            Passez au niveau supérieur
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">Abonnement Premium TradeTracker</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Débloquez des analyses approfondies, des outils avancés et des fonctionnalités exclusives pour optimiser votre trading.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="col-span-1 md:col-span-3 flex justify-center mb-4">
            <Tabs 
              defaultValue="monthly" 
              value={billingPeriod}
              onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                <TabsTrigger value="yearly">Annuel</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <TabsContent value="monthly" className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hidden md:block" /> {/* Spacer for alignment */}
            <PricingPlan
              title="Premium"
              price="19,99 €"
              period="mois"
              description="Pour les traders sérieux qui veulent optimiser leurs performances"
              features={monthlyFeatures}
              recommended={true}
              onSelect={handleSelectPlan}
            />
            <div className="hidden md:block" /> {/* Spacer for alignment */}
          </TabsContent>

          <TabsContent value="yearly" className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hidden md:block" /> {/* Spacer for alignment */}
            <PricingPlan
              title="Premium Annuel"
              price="199,90 €"
              regularPrice="239,88 €"
              period="an"
              description="Notre meilleure offre avec 2 mois offerts"
              features={yearlyFeatures}
              recommended={true}
              discount="17%"
              onSelect={handleSelectPlan}
            />
            <div className="hidden md:block" /> {/* Spacer for alignment */}
          </TabsContent>
        </div>

        <div className="pt-8 border-t">
          <h2 className="text-2xl font-bold text-center mb-8">Fonctionnalités Premium</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={ChartBarIcon}
              title="Analyses Avancées"
              description="Accédez à des métriques et des visualisations détaillées pour comprendre vos performances et optimiser vos stratégies."
            />
            <FeatureCard
              icon={Star}
              title="Analyses temporelles"
              description="Découvrez les meilleurs jours et heures pour trader, identifiez vos patterns les plus rentables en fonction du moment."
            />
            <FeatureCard
              icon={Zap}
              title="Optimisation de Portefeuille"
              description="Recevez des recommandations personnalisées pour équilibrer votre portefeuille et améliorer vos rendements."
            />
          </div>
        </div>

        <Alert className="bg-muted border-primary/20 max-w-3xl mx-auto">
          <Star className="h-5 w-5 text-primary" />
          <AlertTitle>Satisfaction garantie</AlertTitle>
          <AlertDescription>
            Si vous n'êtes pas satisfait de votre abonnement premium, nous vous remboursons intégralement dans les 14 jours suivant votre inscription.
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <Button size="lg" onClick={handleSelectPlan}>
            Passer au Premium maintenant
          </Button>
          <p className="text-muted-foreground mt-4">
            Vous pouvez annuler votre abonnement à tout moment
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
