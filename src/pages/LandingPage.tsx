import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { FileText, BarChart2, Briefcase, TrendingUp, ChartBar, Calendar, Book, Star } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

export default function LandingPage() {
  const navigate = useNavigate();
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const trackingCategories = [
    {
      title: "Journal de trading",
      description: "Enregistrez vos trades et analysez vos performances avec +20 métriques",
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: "Analyse technique",
      description: "Suivez vos stratégies et identifiez vos points forts",
      icon: <BarChart2 className="h-6 w-6" />
    },
    {
      title: "Gestion du capital",
      description: "Optimisez votre money management et limitez les risques",
      icon: <Briefcase className="h-6 w-6" />
    },
    {
      title: "Statistiques avancées",
      description: "Visualisez vos performances avec des graphiques détaillés",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: "Calendrier trading",
      description: "Planifiez et suivez vos sessions de trading efficacement",
      icon: <Calendar className="h-6 w-6" />
    },
    {
      title: "Statistiques comparatives",
      description: "Comparez vos performances avec d'autres traders",
      icon: <ChartBar className="h-6 w-6" />
    }
  ];

  const testimonials = [
    {
      text: "Trades Tracker a transformé ma façon d'analyser mes performances. Je peux maintenant identifier facilement mes schémas de trading gagnants.",
      author: "Alexandre D.",
      role: "Day Trader",
      rating: 5
    },
    {
      text: "Interface intuitive, statistiques claires. Exactement ce dont j'avais besoin pour progresser et être plus disciplinée dans mes trades.",
      author: "Marie L.",
      role: "Investisseur particulier",
      rating: 5
    },
    {
      text: "Le journal de trading est devenu mon meilleur allié. Je comprends mieux mes erreurs et améliore constamment ma stratégie.",
      author: "Thomas B.",
      role: "Swing Trader",
      rating: 5
    }
  ];

  const handleDashboardRedirect = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-5/12 space-y-8 lg:pl-12 lg:mt-0 -mt-20"
            >
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-foreground dark:text-white">Suivez et analysez vos trades avec</span><br />
                  <span style={{ color: '#0080ff' }}>Trades Tracker.</span>
                </h1>
                <p className="text-foreground dark:text-white text-lg">
                  Trades Tracker est l'application qui vous aide à mieux gérer votre trading. Suivez vos performances, analysez vos trades et optimisez votre stratégie.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleDashboardRedirect} 
                    className="rounded-full px-8 bg-[#0080ff] hover:bg-[#0080ff]/80 text-white"
                  >
                    Démarrer gratuitement
                  </Button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10"
              >
                <div>
                  <div className="text-3xl font-bold mb-2" style={{ color: '#0080ff' }}>10,000+</div>
                  <div className="text-foreground dark:text-white">Traders actifs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2" style={{ color: '#0080ff' }}>50M+</div>
                  <div className="text-foreground dark:text-white">Trades analysés</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2" style={{ color: '#0080ff' }}>89%</div>
                  <div className="text-foreground dark:text-white">Taux de satisfaction</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:w-7/12 lg:-mr-20"
            >
              <div className="relative">
                <img
                  src="/lovable-uploads/670604e6-f3d4-410a-90ea-fc3b3decc42a.png"
                  alt="Dashboard Preview"
                  className="w-full h-auto rounded-lg object-cover lg:max-w-[150%]"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-primary/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container px-4 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Toutes les fonctionnalités dont vous avez besoin
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Une suite complète d'outils pour optimiser votre trading
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {trackingCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-background/50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary">
              <Book className="h-4 w-4" />
              <span className="text-sm font-medium">Blog Trading</span>
            </div>
            <h2 className="text-3xl font-bold">
              Découvrez nos articles sur le trading
            </h2>
            <p className="text-lg text-muted-foreground">
              Apprenez de l'expérience des meilleurs traders et restez informé des dernières tendances du marché
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/blog">Accéder au blog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
            <p className="text-muted-foreground">
              Découvrez comment Trades Tracker aide les traders à améliorer leurs performances
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex text-primary">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                          <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                          <div>
                            <p className="font-semibold">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center mt-8 gap-4">
                <CarouselPrevious className="relative static" />
                <CarouselNext className="relative static" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Beta Version Notice */}
      <section className="py-16 bg-background">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <div className="text-primary">ⓘ</div>
                </div>
              </div>
              <h2 className="text-2xl font-bold">Version Bêta - Premium Offert !</h2>
              <p className="text-muted-foreground">
                Vous utilisez actuellement la version bêta de Trades Tracker. Pendant cette période,{' '}
                <span className="text-primary">nous offrons l'accès premium gratuitement</span> à tous nos utilisateurs !
              </p>
              <p className="text-sm text-muted-foreground">
                Pour en bénéficier, il vous suffit d'envoyer un message via notre page contact en précisant votre intérêt
                pour l'accès premium gratuit.
              </p>
              <Button variant="outline" size="lg" className="rounded-full">
                Contacter l'équipe
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-yellow-500/10 p-3">
                  <div className="text-yellow-500">⚠</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold">Avertissement important</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Le trading et les investissements sur les marchés financiers comportent un risque substantiel de perte.
                  Les performances passées ne préjugent pas des résultats futurs.
                </p>
                <p>
                  75% des comptes d'investisseurs particuliers perdent de l'argent lorsqu'ils négocient des produits
                  financiers.
                </p>
                <p>
                  Cette plateforme est conçue pour le suivi et l'analyse de vos activités de trading, et non pour fournir des
                  recommandations d'investissement. Veuillez consulter un conseiller financier professionnel avant de
                  prendre des décisions d'investissement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation CTA Section */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="container px-4 mx-auto text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Prêt à transformer votre trading ?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg mb-8 text-white/90"
          >
            Rejoignez des milliers de traders qui ont amélioré leurs performances grâce à Trades Tracker.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={handleDashboardRedirect} 
              className="rounded-full px-8"
            >
              Commencer gratuitement
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background/50 border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <div className="text-xl font-semibold text-primary">Trades Tracker</div>
              <p className="text-sm text-muted-foreground">Votre compagnon de trading au quotidien</p>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
              <Link to="/premium" className="text-muted-foreground hover:text-primary">Premium</Link>
              <Link to="/demo" className="text-muted-foreground hover:text-primary">Démo</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Trades Tracker. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
