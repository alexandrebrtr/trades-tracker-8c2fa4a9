
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, BookOpen, Calendar, Star } from 'lucide-react';

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      title: "Journal de trading détaillé",
      description: "Enregistrez et analysez chaque trade pour améliorer votre performance",
      icon: <div className="p-2 rounded-full bg-primary/10 text-primary"><BookOpen className="h-6 w-6" /></div>
    },
    {
      title: "Suivi en temps réel",
      description: "Visualisez l'évolution de votre portefeuille et de vos performances",
      icon: <div className="p-2 rounded-full bg-primary/10 text-primary"><Calendar className="h-6 w-6" /></div>
    },
    {
      title: "Analyses avancées",
      description: "Accédez à des statistiques détaillées et des graphiques pertinents",
      icon: <div className="p-2 rounded-full bg-primary/10 text-primary"><Star className="h-6 w-6" /></div>
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
            >
              Devenez un meilleur trader grâce au suivi de vos performances
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Prenez des décisions éclairées grâce à des analyses détaillées de vos trades 
              et développez une stratégie gagnante.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/dashboard">Commencer gratuitement</Link>
              </Button>
              <Button variant="ghost" size="lg" className="rounded-full gap-2">
                En savoir plus <ChevronDown className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border">
              <img
                src="/lovable-uploads/7b5e102a-70c9-4618-a03e-87c1f375227e.png"
                alt="Dashboard Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-muted-foreground">Des outils puissants pour améliorer votre trading</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="h-full border-none shadow-md bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Prêt à améliorer votre trading ?</h2>
            <p className="text-muted-foreground mb-8">
              Rejoignez des milliers de traders qui ont déjà optimisé leurs performances
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/dashboard">Commencer maintenant</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
