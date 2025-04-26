
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ContactForm } from '@/components/contact/ContactForm';
import { Mail, Info, AlertTriangle } from 'lucide-react';

export default function LandingPage() {
  // Animation variant for fade in effect
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Define features array
  const features = [
    {
      title: "Suivi détaillé",
      description: "Suivez chaque trade avec précision et analysez vos performances au fil du temps.",
      icon: <div className="p-2 rounded-full bg-primary/10 text-primary"><Mail className="h-6 w-6" /></div>
    },
    {
      title: "Statistiques avancées",
      description: "Accédez à des statistiques détaillées pour comprendre vos forces et faiblesses.",
      icon: <div className="p-2 rounded-full bg-primary/10 text-primary"><Mail className="h-6 w-6" /></div>
    },
    {
      title: "Journal de trading",
      description: "Documentez vos trades et vos émotions pour améliorer votre stratégie.",
      icon: <div className="p-2 rounded-full bg-primary/10 text-primary"><Mail className="h-6 w-6" /></div>
    }
  ];

  // Define testimonials array
  const testimonials = [
    {
      name: "Alexandre D.",
      role: "Day Trader",
      content: "Trades Tracker a transformé ma façon d'analyser mes performances. Je peux maintenant identifier facilement mes schémas de trading gagnants."
    },
    {
      name: "Marie L.",
      role: "Investisseur particulier",
      content: "Interface intuitive, statistiques claires. Exactement ce dont j'avais besoin pour progresser et être plus disciplinée dans mes trades."
    },
    {
      name: "Thomas B.",
      role: "Swing Trader",
      content: "Le journal de trading est devenu mon meilleur allié. Je comprends mieux mes erreurs et améliore constamment ma stratégie."
    }
  ];

  const stats = [
    { value: "10,000+", label: "Traders actifs" },
    { value: "50M+", label: "Trades analysés" },
    { value: "89%", label: "Taux de satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      {/* Hero Section with Screenshots */}
      <section className="relative pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="block">Suivre. Optimiser.</span>
                <span className="text-primary">Trader.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                Trades Tracker est l'application qui vous aide à mieux gérer votre trading.
                Suivez vos performances, analysez vos trades et optimisez votre stratégie.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/dashboard">Démarrer gratuitement</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/login">Se connecter</Link>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-8 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[4/3] lg:-mr-20"
            >
              {/* Desktop Screenshot */}
              <div className="absolute inset-0">
                <img
                  src="/lovable-uploads/7b5e102a-70c9-4618-a03e-87c1f375227e.png"
                  alt="Dashboard Preview"
                  className="rounded-xl shadow-2xl border border-border w-full h-full object-cover"
                />
              </div>

              {/* Mobile Screenshot - Overlapping */}
              <img
                src="/lovable-uploads/add96841-d5f8-4327-a5d6-5f1b97236b33.png"
                alt="Mobile Dashboard"
                className="absolute -bottom-10 -right-10 w-48 md:w-64 rounded-xl shadow-2xl border border-border z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mx-auto">
              Tout ce dont vous avez besoin pour améliorer votre trading
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-none shadow-md bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground flex-1">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section - Updated with Contact Form */}
      <section className="py-12 md:py-24 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
                Une question ? Contactez-nous !
              </h2>
              <p className="text-base md:text-xl text-muted-foreground mb-6">
                Notre équipe est là pour vous aider à tirer le meilleur parti de Trades Tracker. 
                N'hésitez pas à nous contacter pour toute question ou suggestion.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Support réactif",
                  "Experts en trading",
                  "Accompagnement personnalisé",
                  "Réponse sous 24h"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Mail className="h-5 w-5 text-primary mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-lg shadow-xl p-6"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[800px] mx-auto">
              Découvrez comment Trades Tracker aide les traders à améliorer leurs performances
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-card shadow border-none">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                    </div>
                    <p className="text-muted-foreground italic flex-1 mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Version Information Section - NEW */}
      <section className="py-10 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="max-w-[800px] mx-auto text-center">
            <Info className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Version Bêta - Premium Offert !</h2>
            <p className="text-muted-foreground mb-4">
              Vous utilisez actuellement la version bêta de Trades Tracker. Pendant cette période, 
              <strong className="text-primary"> nous offrons l'accès premium gratuitement</strong> à tous nos utilisateurs !
            </p>
            <p className="text-muted-foreground mb-6">
              Pour en bénéficier, il vous suffit d'envoyer un message via notre page contact en précisant votre intérêt 
              pour l'accès premium gratuit.
            </p>
            <Button asChild className="rounded-full px-8 w-full sm:w-auto">
              <Link to="/contact">Contacter l'équipe</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer Section - Avertissement supplémentaire */}
      <section className="py-10 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="max-w-[800px] mx-auto text-center">
            <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-amber-500" />
            <h2 className="text-2xl font-bold mb-4">Avertissement important</h2>
            <p className="text-muted-foreground mb-4">
              Le trading et les investissements sur les marchés financiers comportent un risque substantiel de perte. 
              Les performances passées ne préjugent pas des résultats futurs.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>75% des comptes d'investisseurs particuliers perdent de l'argent</strong> lorsqu'ils négocient des produits financiers.
            </p>
            <p className="text-muted-foreground">
              Cette plateforme est conçue pour le suivi et l'analyse de vos activités de trading, et non pour fournir des recommandations d'investissement. 
              Veuillez consulter un conseiller financier professionnel avant de prendre des décisions d'investissement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="max-w-[800px] mx-auto"
          >
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              Prêt à transformer votre trading ?
            </h2>
            <p className="text-base md:text-xl opacity-90 mb-6 md:mb-8">
              Rejoignez des milliers de traders qui ont amélioré leurs performances grâce à Trades Tracker.
            </p>
            <Button size="lg" variant="secondary" asChild className="rounded-full px-8 w-full sm:w-auto">
              <Link to="/login">Commencer gratuitement</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-10 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-primary font-semibold text-xl mb-2">
                Trades Tracker
              </h3>
              <p className="text-muted-foreground">
                Votre compagnon de trading au quotidien
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:flex-row md:items-center gap-4 md:gap-8">
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              <Link to="/premium" className="text-muted-foreground hover:text-foreground">
                Premium
              </Link>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                Démo
              </Link>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Trades Tracker. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
