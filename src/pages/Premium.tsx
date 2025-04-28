
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, HelpCircle, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/navigation/Header';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AppLayout } from '@/components/layout/AppLayout';
import { TestimonialsCarousel } from '@/components/landing/TestimonialsCarousel';

export default function Premium() {
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

  const pricingPlans = [
    {
      name: "Gratuit",
      price: 0,
      description: "L'essentiel pour commencer à trader",
      features: [
        "Journal de trading basique",
        "Statistiques simples",
        "Jusqu'à 10 trades par mois",
        "Support par email",
        "Exportation CSV"
      ],
      notIncluded: [
        "Analyses avancées",
        "Alertes personnalisées",
        "Intégrations exclusives",
        "Support prioritaire"
      ],
      cta: "Commencer gratuitement",
      isPopular: false,
      color: "bg-card"
    },
    {
      name: "Premium Mensuel",
      price: 10,
      description: "Pour les traders sérieux",
      features: [
        "Journal de trading illimité",
        "Statistiques avancées",
        "Trades illimités",
        "Alertes personnalisées",
        "Support prioritaire",
        "Intégrations exclusives",
        "Exportations multiformats"
      ],
      notIncluded: [],
      cta: "S'abonner",
      isPopular: true,
      color: "bg-primary/5 border-primary/30"
    },
    {
      name: "Premium Annuel",
      price: 100/12,
      yearPrice: 100,
      description: "Pour les traders sérieux avec 16% d'économie",
      features: [
        "Journal de trading illimité",
        "Statistiques avancées",
        "Trades illimités",
        "Alertes personnalisées",
        "Support prioritaire",
        "Intégrations exclusives",
        "Exportations multiformats"
      ],
      notIncluded: [],
      cta: "S'abonner",
      isPopular: false,
      color: "bg-card"
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  };

  return (
    <AppLayout>
      <main>
        {/* Hero Section */}
        <section className="py-8 md:py-12 bg-background">
          <div className="container px-4 mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Choisissez le plan qui vous convient
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              Des fonctionnalités puissantes pour tous les niveaux de traders, du débutant au professionnel.
            </motion.p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-8 lg:py-16 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card 
                  key={`${plan.name}-${index}`} 
                  className={cn(
                    "relative overflow-hidden transition-all", 
                    plan.isPopular && "border-primary/30 shadow-lg"
                  )}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-white text-xs font-medium py-1 px-3 rounded-bl">
                        Populaire
                      </div>
                    </div>
                  )}
                  
                  {index === 2 && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-white text-xs font-medium py-1 px-3 rounded-bl">
                        -16% sur l'année
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    
                    <div className="mt-4">
                      {plan.price === 0 ? (
                        <div className="text-4xl font-bold">Gratuit</div>
                      ) : (
                        <>
                          <div className="flex items-baseline">
                            <span className="text-4xl font-bold">{formatCurrency(plan.price)}</span>
                            <span className="text-muted-foreground ml-1">/mois</span>
                          </div>
                          
                          {index === 2 && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(plan.yearPrice as number)} facturé annuellement
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      
                      {plan.notIncluded.map((feature, i) => (
                        <li key={i} className="flex items-start text-muted-foreground">
                          <X className="h-5 w-5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className={cn("w-full", plan.isPopular ? "" : "variant-outline")} 
                      variant={plan.isPopular ? "default" : "outline"}
                      onClick={handleUpgrade}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Questions fréquentes</h2>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
              {faqData.map((item, index) => (
                <Card key={index} className="border-primary/10">
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

        {/* Testimonials Carousel Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ce que nos clients disent</h2>
              <p className="text-muted-foreground">
                Découvrez comment nos utilisateurs améliorent leurs performances de trading
              </p>
            </div>
            
            <TestimonialsCarousel staticTestimonials={testimonials} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 md:py-16 bg-primary text-white text-center">
          <div className="container px-4 mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold mb-6"
            >
              Boostez votre trading dès aujourd'hui !
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg mb-8 max-w-3xl mx-auto text-white/90"
            >
              Rejoignez la communauté Premium et profitez d'outils exclusifs pour optimiser vos performances.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90" onClick={handleUpgrade}>
                Commencer maintenant
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
