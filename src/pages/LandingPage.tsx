import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, LineChart, TrendingUp, PieChart, Wallet, BarChart2, ArrowRight, FileText, ChartBar, BriefCase } from 'lucide-react';

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      title: "Suivi de performance",
      description: "Analysez vos trades et optimisez vos stratégies grâce à des statistiques détaillées",
      icon: <div className="p-2 rounded-full bg-primary/10 text-primary"><LineChart className="h-6 w-6" /></div>
    },
    {
      title: "Journal de trading",
      description: "Gardez une trace détaillée de chaque trade avec notes et analyses",
      icon: <div className="p-2 rounded-full bg-primary/10 text-primary"><TrendingUp className="h-6 w-6" /></div>
    },
    {
      title: "Analyses avancées",
      description: "Visualisez vos performances avec des graphiques clairs et pertinents",
      icon: <div className="p-2 rounded-full bg-primary/10 text-primary"><PieChart className="h-6 w-6" /></div>
    }
  ];

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
              Le meilleur outil pour suivre et améliorer vos performances de trading
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Une plateforme complète pour analyser vos trades, suivre vos performances 
              et optimiser vos stratégies. Tout ce dont vous avez besoin, gratuit.
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

          {/* Dashboard Preview */}
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

      {/* Features Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Un outil complet pour votre trading</h2>
            <p className="text-muted-foreground">Tout ce dont vous avez besoin pour améliorer vos performances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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

      {/* CTA Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Prêt à améliorer votre trading ?</h2>
            <p className="text-muted-foreground mb-8">
              Rejoignez des milliers de traders qui ont déjà optimisé leurs performances
            </p>
            <Button asChild size="lg" className="rounded-full px-8 gap-2">
              <Link to="/dashboard">
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
