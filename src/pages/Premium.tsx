
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Check, HelpCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/navigation/Header';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Premium() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const navigate = useNavigate();

  const testimonials = [
    {
      id: "1",
      text: "L'accès Premium a révolutionné ma façon de trader. Les analyses avancées valent largement l'investissement.",
      author: "Mathieu R.",
      role: "Trader Professionnel",
      rating: 5,
      avatar: "/lovable-uploads/6b9faeba-9821-4d33-be9c-6a099aa8c1fe.png"
    },
    {
      id: "2",
      text: "Les fonctionnalités d'analyse comparative m'ont permis d'affiner ma stratégie et d'augmenter significativement mes gains.",
      author: "Julie D.",
      role: "Swing Trader",
      rating: 5,
      avatar: "/lovable-uploads/7b5e102a-70c9-4618-a03e-87c1f375227e.png"
    },
    {
      id: "3",
      text: "Le retour sur investissement est impressionnant. J'ai récupéré le coût de l'abonnement annuel en seulement deux trades.",
      author: "Antoine B.",
      role: "Day Trader",
      rating: 5,
      avatar: "/lovable-uploads/68631625-1d14-4206-b940-611ff6fce57e.png"
    }
  ];

  const pricingPlans = {
    monthly: {
      price: 29.99,
      discountedPrice: 19.99,
    },
    annual: {
      price: 299.99,
      discountedPrice: 199.99,
    },
  };

  const features = [
    { name: 'Journal de trading illimité', monthly: true, annual: true },
    { name: 'Statistiques avancées', monthly: true, annual: true },
    { name: 'Alertes personnalisées', monthly: true, annual: true },
    { name: 'Accès prioritaire au support', monthly: true, annual: true },
    { name: 'Intégrations exclusives', monthly: true, annual: true },
  ];

  const faqData = [
    {
      question: "Qu'est-ce qui est inclus dans l'abonnement Premium ?",
      answer: "L'abonnement Premium offre un accès illimité à toutes les fonctionnalités de l'application, y compris les statistiques avancées, les alertes personnalisées, l'accès prioritaire au support et des intégrations exclusives."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. L'accès Premium restera actif jusqu'à la fin de la période de facturation en cours."
    },
    {
      question: "Offrez-vous une garantie de remboursement ?",
      answer: "Oui, nous offrons une garantie de remboursement de 30 jours. Si vous n'êtes pas satisfait de l'abonnement Premium, contactez notre support client dans les 30 jours suivant votre achat pour un remboursement complet."
    }
  ];

  const handleUpgrade = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container px-4 mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Débloquez le potentiel de votre trading avec Premium
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              Accédez à des outils d'analyse avancés, des alertes personnalisées et un support prioritaire pour optimiser votre stratégie de trading.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="rounded-full px-8" onClick={handleUpgrade}>
                Passer à Premium
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Choisissez votre plan Premium</h2>
              <p className="text-muted-foreground">
                Profitez de nos offres exclusives et accédez à des fonctionnalités avancées pour améliorer vos performances de trading.
              </p>
            </div>

            <Tabs defaultValue="monthly" className="w-full max-w-md mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly" onClick={() => setBillingCycle('monthly')}>Mensuel</TabsTrigger>
                <TabsTrigger value="annual" onClick={() => setBillingCycle('annual')}>Annuel</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly" className="mt-6">
                <Card className="border-primary/20">
                  <CardHeader className="space-y-2.5">
                    <h3 className="text-2xl font-semibold">Abonnement Mensuel</h3>
                    <p className="text-muted-foreground">Accès complet à toutes les fonctionnalités Premium.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <span className="text-5xl font-bold">
                        ${billingCycle === 'monthly' ? pricingPlans.monthly.discountedPrice : pricingPlans.annual.discountedPrice}
                      </span>
                      <span className="text-xl text-muted-foreground">/mois</span>
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      <span className="text-lg text-muted-foreground line-through">
                        ${billingCycle === 'monthly' ? pricingPlans.monthly.price : pricingPlans.annual.price}
                      </span>
                      <span className="text-sm text-primary ml-2">Offre limitée</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full rounded-full" onClick={handleUpgrade}>
                      S'abonner
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="annual" className="mt-6">
                <Card className="border-primary/20">
                  <CardHeader className="space-y-2.5">
                    <h3 className="text-2xl font-semibold">Abonnement Annuel</h3>
                    <p className="text-muted-foreground">Économisez jusqu'à 30% avec l'abonnement annuel.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <span className="text-5xl font-bold">
                        ${billingCycle === 'monthly' ? pricingPlans.monthly.discountedPrice : pricingPlans.annual.discountedPrice}
                      </span>
                      <span className="text-xl text-muted-foreground">/an</span>
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      <span className="text-lg text-muted-foreground line-through">
                        ${billingCycle === 'monthly' ? pricingPlans.monthly.price * 12 : pricingPlans.annual.price}
                      </span>
                      <span className="text-sm text-primary ml-2">Offre limitée</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full rounded-full" onClick={handleUpgrade}>
                      S'abonner
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-center space-x-4">
                    {feature.monthly && feature.annual ? (
                      <Check className="text-green-500 h-6 w-6" />
                    ) : (
                      <X className="text-red-500 h-6 w-6" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{feature.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section with Carousel */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Ils ont choisi Premium</h2>
              <p className="text-muted-foreground">
                Découvrez comment nos abonnés Premium améliorent leurs performances de trading
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= testimonial.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                    <div className="flex items-center pt-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Foire aux questions</h2>
              <p className="text-muted-foreground">
                Trouvez les réponses aux questions les plus fréquemment posées sur l'abonnement Premium.
              </p>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              {faqData.map((item, index) => (
                <Card key={index} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-start">
                      <h3 className="text-lg font-semibold">{item.question}</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Besoin d'aide ? Contactez notre support client.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-primary text-white text-center">
          <div className="container px-4 mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Boostez votre trading dès aujourd'hui !
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90"
            >
              Rejoignez la communauté Premium et profitez d'outils exclusifs pour optimiser vos performances et atteindre vos objectifs financiers.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="rounded-full px-8 bg-secondary text-primary hover:bg-secondary/80" onClick={handleUpgrade}>
                Passer à Premium
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
