import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Wallet, BarChart2, ChartBar, TrendingUp, Briefcase, Star, Smartphone, PcCase } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const tools = [
    {
      title: "Gestion de portefeuille",
      description: "Suivez l'évolution de votre capital et de vos positions en temps réel",
      icon: <Wallet className="h-6 w-6" />,
      stats: "100% gratuit"
    },
    {
      title: "Statistiques avancées",
      description: "Ratio de Sharpe, drawdown, win rate et autres métriques essentielles",
      icon: <BarChart2 className="h-6 w-6" />,
      stats: "+20 métriques"
    }
  ];

  const trackingCategories = [
    {
      title: "Journal de trading",
      description: "Enregistrez vos trades et analysez vos performances avec +20 métriques",
      icon: "/lovable-uploads/6b9faeba-9821-4d33-be9c-6a099aa8c1fe.png"
    },
    {
      title: "Analyse technique",
      description: "Suivez vos stratégies et identifiez vos points forts",
      icon: "/lovable-uploads/57a22622-92bf-4e4a-871d-1436a6ee3bb2.png"
    },
    {
      title: "Gestion du capital",
      description: "Optimisez votre money management et limitez les risques",
      icon: "/lovable-uploads/08082885-3fcb-46d9-b3a4-e5140c20d702.png"
    },
    {
      title: "Statistiques avancées",
      description: "Visualisez vos performances avec des graphiques détaillés",
      icon: "/lovable-uploads/add96841-d5f8-4327-a5d6-5f1b97236b33.png"
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

  return (
    <div className="min-h-screen bg-[#0A0E17]">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-5/12 space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-white">Suivre. Optimiser.</span><br />
                  <span className="text-[#0EA5E9]">Trader.</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-xl">
                  Trades Tracker est l'application qui vous aide à mieux gérer votre trading. Suivez vos performances, analysez vos trades et optimisez votre stratégie.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white rounded-full px-8">
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
                  <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                  <div className="text-gray-400">Traders actifs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">50M+</div>
                  <div className="text-gray-400">Trades analysés</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">89%</div>
                  <div className="text-gray-400">Taux de satisfaction</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:w-7/12"
            >
              <div className="relative h-full">
                <img
                  src="/lovable-uploads/670604e6-f3d4-410a-90ea-fc3b3decc42a.png"
                  alt="Dashboard Preview"
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-primary/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] -z-10" />
      </section>

      {/* Tracking Section */}
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
              Suivre vos performances,<br />
              en pilote automatique
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              On ne peut pas améliorer ce que l'on ne suit pas.<br />
              Nous automatisons le suivi de vos performances de trading.
            </p>
            <div className="p-4 bg-secondary/20 rounded-lg mb-8">
              <p className="text-muted-foreground">
                Économisez des heures sur l'analyse de vos trades
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {trackingCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-card hover:shadow-lg transition-shadow overflow-hidden">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-32 h-24 relative rounded-lg overflow-hidden bg-black/5">
                      <img
                        src={category.icon}
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/dashboard">Commencer gratuitement</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Premium Trading Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square max-w-lg mx-auto lg:mx-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl" />
              <div className="relative bg-card p-6 rounded-3xl shadow-xl overflow-hidden border border-border">
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                  <img
                    src="/lovable-uploads/bb895995-774e-458a-9166-661f9804f512.png"
                    alt="Premium Trading"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <ChartBar className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">Premium Trading</h3>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">18 186 €</div>
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <TrendingUp className="h-4 w-4" />
                      <span>+21.24%</span>
                    </div>
                  </div>
                  <div className="h-32 bg-black/5 rounded-lg" /> {/* Placeholder for chart */}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:pl-6"
            >
              <div className="max-w-lg">
                <div className="flex items-center gap-2 text-primary mb-6">
                  <Briefcase className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase">Trading Premium</span>
                </div>
                <h2 className="text-4xl font-bold mb-8">
                  Le trading de nouvelle génération
                </h2>
                <ul className="space-y-6">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 text-primary">✓</div>
                    <p className="text-muted-foreground">
                      Découvrez notre analyse technique avancée avec les indicateurs les plus performants du marché
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 text-primary">✓</div>
                    <p className="text-muted-foreground">
                      Accédez à des outils d'analyse statistique exclusifs pour optimiser vos stratégies
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 text-primary">✓</div>
                    <p className="text-muted-foreground">
                      Profitez d'un suivi personnalisé de vos performances et d'alertes en temps réel
                    </p>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button size="lg" className="rounded-full px-8">
                    Commencer à trader
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                        <p className="text-muted-foreground mb-4">{tool.description}</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                          {tool.stats}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            <Button size="lg" variant="secondary" className="rounded-full px-8">
              Commencer gratuitement
            </Button>
          </motion.div>
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

      {/* Contact Section */}
      <section className="py-20 bg-background/50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-6">Une question ? Contactez-nous !</h2>
              <p className="text-muted-foreground mb-8">
                Notre équipe est là pour vous aider à tirer le meilleur parti de Trades Tracker. N'hésitez pas à nous contacter pour toute question ou suggestion.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-5 h-5 text-primary">✓</div>
                  Support réactif
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-5 h-5 text-primary">✓</div>
                  Experts en trading
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-5 h-5 text-primary">✓</div>
                  Accompagnement personnalisé
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-5 h-5 text-primary">✓</div>
                  Réponse sous 24h
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <ContactForm />
            </div>
          </div>
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
