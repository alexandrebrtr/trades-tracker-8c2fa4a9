import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { FileText, BarChart2, Briefcase, TrendingUp, ChartBar, Calendar, Book, Star, MessageSquare, Send } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';

export default function LandingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

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
      rating: 5,
      avatar: "/lovable-uploads/6b9faeba-9821-4d33-be9c-6a099aa8c1fe.png"
    },
    {
      text: "Interface intuitive, statistiques claires. Exactement ce dont j'avais besoin pour progresser et être plus disciplinée dans mes trades.",
      author: "Marie L.",
      role: "Investisseur particulier",
      rating: 5,
      avatar: "/lovable-uploads/7b5e102a-70c9-4618-a03e-87c1f375227e.png"
    },
    {
      text: "Le journal de trading est devenu mon meilleur allié. Je comprends mieux mes erreurs et améliore constamment ma stratégie.",
      author: "Thomas B.",
      role: "Swing Trader",
      rating: 5,
      avatar: "/lovable-uploads/68631625-1d14-4206-b940-611ff6fce57e.png"
    },
    {
      text: "Après avoir testé plusieurs outils, Trades Tracker est définitivement le plus complet. Les fonctionnalités premium valent vraiment l'investissement.",
      author: "Sophie M.",
      role: "Trader Forex",
      rating: 5,
      avatar: "/lovable-uploads/75bc79d3-a83c-4eac-88bb-45983d822da6.png"
    }
  ];

  const handleDashboardRedirect = () => {
    navigate('/dashboard');
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Message vide",
        description: "Veuillez entrer un message avant d'envoyer",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Message envoyé",
      description: "Merci pour votre message. Notre équipe vous répondra prochainement.",
    });
    
    setMessage('');
  };
  
  const handleRating = (rating: number) => {
    setUserRating(rating);
    
    toast({
      title: "Merci pour votre évaluation !",
      description: `Vous avez attribué une note de ${rating}/5 à Trades Tracker.`,
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden py-20 lg:pt-24 lg:pb-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-5/12 space-y-4 sm:space-y-6 lg:space-y-8 lg:pl-8 pt-16 lg:pt-0"
            >
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-foreground dark:text-white">Suivez, Optimisez, Tradez.</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/90 dark:text-white/90 max-w-xl">
                  Trades Tracker est l'application qui vous aide à mieux gérer votre trading. Suivez vos performances, analysez vos trades et optimisez votre stratégie.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    size={isMobile ? "default" : "lg"} 
                    onClick={handleDashboardRedirect} 
                    className="rounded-full px-6 sm:px-8 bg-[#0080ff] hover:bg-[#0080ff]/80 text-white w-full sm:w-auto"
                  >
                    Démarrer gratuitement
                  </Button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8 pt-6 sm:pt-8 border-t border-white/10"
              >
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#0080ff' }}>10,000+</div>
                  <div className="text-xs sm:text-sm lg:text-base text-foreground/80 dark:text-white/80">Traders actifs</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#0080ff' }}>50M+</div>
                  <div className="text-xs sm:text-sm lg:text-base text-foreground/80 dark:text-white/80">Trades analysés</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#0080ff' }}>89%</div>
                  <div className="text-xs sm:text-sm lg:text-base text-foreground/80 dark:text-white/80">Taux de satisfaction</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:w-7/12 lg:absolute lg:right-0 lg:-mr-4 mt-8 lg:mt-0"
            >
              <div className="relative px-4 sm:px-0">
                <img
                  src="/lovable-uploads/20fd8bfd-5ad7-4e39-846b-320e2e599978.png"
                  alt="Dashboard Preview"
                  className="block w-[70%] h-auto object-contain mx-auto lg:max-w-[65%] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 shadow-lg rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-primary/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="container px-4 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              Toutes les fonctionnalités dont vous avez besoin
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8">
              Une suite complète d'outils pour optimiser votre trading
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
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
      <section className="py-12 sm:py-16 bg-background/50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary">
              <Book className="h-4 w-4" />
              <span className="text-sm font-medium">Blog Trading</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Découvrez nos articles sur le trading
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
      </section>
      
      {/* Message Space Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Une question ? Contactez-nous</h2>
              <p className="text-muted-foreground">
                Notre équipe est disponible pour répondre à toutes vos questions sur Trades Tracker
              </p>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="message" className="font-medium">Votre message</label>
                  <Textarea 
                    id="message"
                    placeholder="Posez votre question ou partagez votre feedback..."
                    className="resize-none"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSendMessage}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Envoyer le message
                  </Button>
                </div>
              </div>
            </div>
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
      <section className="py-20 sm:py-32 bg-primary relative overflow-hidden">
        <div className="container px-4 mx-auto text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
          >
            Prêt à transformer votre trading ?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto"
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
              size={isMobile ? "default" : "lg"} 
              variant="secondary" 
              onClick={handleDashboardRedirect} 
              className="rounded-full px-6 sm:px-8"
            >
              Commencer gratuitement
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer with rating system */}
      <footer className="py-10 sm:py-12 bg-background/50 border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 mb-8">
            <div>
              <div className="text-lg sm:text-xl font-semibold text-primary">Trades Tracker</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Votre compagnon de trading au quotidien</p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    className="focus:outline-none"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRating(star)}
                  >
                    <Star 
                      className={`h-7 w-7 ${
                        star <= (hoverRating || userRating) 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-muted-foreground'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {userRating > 0 
                  ? `Merci pour votre note de ${userRating}/5 !` 
                  : 'Notez notre application'
                }
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">4.8</span>/5 - basé sur <span className="font-medium">1,245</span> avis
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 py-8 border-y border-border">
            <div>
              <h3 className="font-medium text-lg mb-4">Navigation</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">Tableau de bord</Link>
                <Link to="/journal" className="text-sm text-muted-foreground hover:text-primary">Journal de trading</Link>
                <Link to="/statistics" className="text-sm text-muted-foreground hover:text-primary">Statistiques</Link>
                <Link to="/calendar" className="text-sm text-muted-foreground hover:text-primary">Calendrier</Link>
                <Link to="/premium" className="text-sm text-muted-foreground hover:text-primary">Premium</Link>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">À propos</h3>
              <div className="flex flex-col gap-2">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">Notre équipe</Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
                <Link to="/premium" className="text-sm text-muted-foreground hover:text-primary">Tarifs</Link>
                <Link to="/demo" className="text-sm text-muted-foreground hover:text-primary">Démo</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Légal</h3>
              <div className="flex flex-col gap-2">
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Conditions d'utilisation</Link>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Politique de confidentialité</Link>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary">Gestion des cookies</Link>
                <Link to="/mentions" className="text-sm text-muted-foreground hover:text-primary">Mentions légales</Link>
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025 Trades Tracker. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
