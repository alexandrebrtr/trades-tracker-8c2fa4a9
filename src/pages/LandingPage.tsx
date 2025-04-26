import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  BarChart3, 
  LineChart, 
  Wallet, 
  Calendar, 
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  AlertTriangle,
  Info,
  Play,
  Video,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AppLayout } from '@/components/layout/AppLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ContactForm } from '@/components/contact/ContactForm';

export default function LandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const isMobile = useIsMobile();

  const features = [
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: "Analyses de performance",
      description: "Visualisez vos performances avec des graphiques détaillés et des indicateurs clés."
    },
    {
      icon: <LineChart className="h-10 w-10 text-primary" />,
      title: "Suivi des trades",
      description: "Enregistrez et analysez tous vos trades sur une plateforme centralisée."
    },
    {
      icon: <Wallet className="h-10 w-10 text-primary" />,
      title: "Gestion de portefeuille",
      description: "Surveillez l'évolution de votre capital et optimisez vos allocations."
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Calendrier de trading",
      description: "Planifiez vos activités de trading et suivez votre progression au fil du temps."
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Synchronisation automatique",
      description: "Connectez votre compte de broker pour importer automatiquement vos trades."
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
      title: "Journal de trading",
      description: "Documentez vos stratégies et apprenez de vos succès et erreurs."
    }
  ];

  const testimonials = [
    {
      name: "Thomas L.",
      role: "Day Trader",
      content: "Depuis que j'utilise Trades Tracker, ma discipline de trading s'est nettement améliorée. Les analyses de performance m'ont permis d'identifier mes points faibles."
    },
    {
      name: "Sophie M.",
      role: "Investisseur Crypto",
      content: "L'intégration avec Binance est parfaite ! Mes trades sont synchronisés automatiquement et je peux enfin voir clairement ma performance globale."
    },
    {
      name: "Marc D.",
      role: "Trader Forex",
      content: "Le journal de trading a transformé ma façon d'aborder le marché. Je peux maintenant revoir mes décisions et affiner ma stratégie en conséquence."
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <AppLayout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-secondary/20 pb-8 md:pb-16 pt-16 md:pt-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <motion.h1 
                className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              >
                Suivez et analysez vos trades avec{isMobile ? ' ' : <br />}
                <span className="text-primary">Trades Tracker</span>
              </motion.h1>
              <motion.p 
                className="text-lg md:text-2xl text-muted-foreground max-w-[800px]"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Suivez vos performances, analysez vos trades et améliorez votre stratégie avec notre plateforme intuitive.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8 w-full sm:w-auto"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button asChild size="lg" className="rounded-full px-8 w-full sm:w-auto">
                  <Link to="/login">Commencer gratuitement</Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 w-full sm:w-auto">
                  <Link to="/dashboard">Voir la démo</Link>
                </Button>
              </motion.div>
            </div>
            
            {/* Video Section - Amélioré */}
            <motion.div 
              className="relative mx-auto max-w-5xl rounded-xl border shadow-2xl overflow-hidden mt-8 md:mt-12"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <AspectRatio ratio={16/9} className="bg-black">
                {isVideoPlaying ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/0f6Y863mHcY?autoplay=1" 
                    title="Présentation de Trades Tracker" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 bg-cover bg-center flex items-center justify-center" 
                       style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop')" }}>
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="relative z-10 rounded-full px-8 hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                      onClick={handlePlayVideo}
                    >
                      <Play className="h-6 w-6" />
                      <span>Regarder la vidéo</span>
                    </Button>
                  </div>
                )}
              </AspectRatio>
            </motion.div>
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
    </AppLayout>
  );
}
