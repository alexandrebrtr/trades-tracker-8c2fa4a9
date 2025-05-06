import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { Card, CardContent } from '@/components/ui/card';
import { TestimonialsCarousel, Testimonial } from '@/components/landing/TestimonialsCarousel';
import { RatingSystem } from '@/components/landing/RatingSystem';
import { FileText, BarChart2, Briefcase, TrendingUp, ChartBar, Calendar, Book, Star, MessageSquare, Send } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const trackingCategories = [
    {
      title: t('landing.features.journal'),
      description: t('landing.features.journalDesc'),
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: t('landing.features.technical'),
      description: t('landing.features.technicalDesc'),
      icon: <BarChart2 className="h-6 w-6" />
    },
    {
      title: t('landing.features.capital'),
      description: t('landing.features.capitalDesc'),
      icon: <Briefcase className="h-6 w-6" />
    },
    {
      title: t('landing.features.stats'),
      description: t('landing.features.statsDesc'),
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: t('landing.features.calendar'),
      description: t('landing.features.calendarDesc'),
      icon: <Calendar className="h-6 w-6" />
    },
    {
      title: t('landing.features.comparative'),
      description: t('landing.features.comparativeDesc'),
      icon: <ChartBar className="h-6 w-6" />
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: "1",
      text: t('testimonials.alex'),
      author: "Alexandre D.",
      role: t('testimonials.alexRole'),
      rating: 5,
      avatar: "/lovable-uploads/6b9faeba-9821-4d33-be9c-6a099aa8c1fe.png"
    },
    {
      id: "2",
      text: t('testimonials.marie'),
      author: "Marie L.",
      role: t('testimonials.marieRole'),
      rating: 5,
      avatar: "/lovable-uploads/7b5e102a-70c9-4618-a03e-87c1f375227e.png"
    },
    {
      id: "3",
      text: t('testimonials.thomas'),
      author: "Thomas B.",
      role: t('testimonials.thomasRole'),
      rating: 5,
      avatar: "/lovable-uploads/68631625-1d14-4206-b940-611ff6fce57e.png"
    },
    {
      id: "4",
      text: t('testimonials.sophie'),
      author: "Sophie M.",
      role: t('testimonials.sophieRole'),
      rating: 5,
      avatar: "/lovable-uploads/75bc79d3-a83c-4eac-88bb-45983d822da6.png"
    }
  ];

  const handleDashboardRedirect = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden py-20 lg:pt-24 lg:pb-16 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-5/12 space-y-4 sm:space-y-6 lg:space-y-8 pt-16 lg:pt-0"
            >
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-foreground dark:text-white">{t('landing.hero.title')}</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/90 dark:text-white/90 max-w-xl">
                  {t('landing.hero.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    size={isMobile ? "default" : "lg"} 
                    onClick={handleDashboardRedirect} 
                    className="rounded-full px-6 sm:px-8 bg-[#0080ff] hover:bg-[#0080ff]/80 text-white w-full sm:w-auto"
                  >
                    {t('landing.hero.cta')}
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
                  <div className="text-xs sm:text-sm lg:text-base text-foreground/80 dark:text-white/80">{t('landing.stats.activeTraders')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#0080ff' }}>50M+</div>
                  <div className="text-xs sm:text-sm lg:text-base text-foreground/80 dark:text-white/80">{t('landing.stats.analyzedTrades')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#0080ff' }}>89%</div>
                  <div className="text-xs sm:text-sm lg:text-base text-foreground/80 dark:text-white/80">{t('landing.stats.satisfaction')}</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full lg:w-7/12"
            >
              <div className="relative w-full h-full">
                <img
                  src="/lovable-uploads/20fd8bfd-5ad7-4e39-846b-320e2e599978.png"
                  alt="Dashboard Preview"
                  className="block w-full h-auto object-contain lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 shadow-lg rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-primary/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              {t('landing.features.title')}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8">
              {t('landing.features.subtitle')}
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
      <section className="py-12 sm:py-16 bg-background/50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary">
              <Book className="h-4 w-4" />
              <span className="text-sm font-medium">{t('landing.blog.section')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {t('landing.blog.title')}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              {t('landing.blog.description')}
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/blog">{t('landing.blog.button')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Now with Carousel */}
      <section className="py-20 bg-background w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('landing.testimonials.title')}</h2>
            <p className="text-muted-foreground">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <TestimonialsCarousel staticTestimonials={testimonials} />
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-20 bg-muted/30 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('landing.contact.title')}</h2>
              <p className="text-muted-foreground">
                {t('landing.contact.subtitle')}
              </p>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-6 shadow-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Beta Version Notice */}
      <section className="py-16 bg-background w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 mx-auto max-w-4xl">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <div className="text-primary">ⓘ</div>
                </div>
              </div>
              <h2 className="text-2xl font-bold">{t('landing.beta.title')}</h2>
              <p className="text-muted-foreground">
                {t('landing.beta.description')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('landing.beta.note')}
              </p>
              <Button variant="outline" size="lg" className="rounded-full">
                {t('landing.beta.contactButton')}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-yellow-500/10 p-3">
                  <div className="text-yellow-500">⚠</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold">{t('landing.warning.title')}</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>{t('landing.warning.risk')}</p>
                <p>{t('landing.warning.lossRate')}</p>
                <p>{t('landing.warning.purpose')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation CTA Section */}
      <section className="py-20 sm:py-32 bg-primary relative overflow-hidden w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 mx-auto text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
          >
            {t('landing.cta.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto"
          >
            {t('landing.cta.subtitle')}
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
              {t('landing.cta.button')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer with dynamic rating system */}
      <footer className="py-10 sm:py-12 bg-background/50 border-t border-border w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 mb-8">
            <div>
              <div className="text-lg sm:text-xl font-semibold text-primary">Trades Tracker</div>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('landing.footer.slogan')}</p>
            </div>
            
            <RatingSystem />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 py-8 border-y border-border">
            <div>
              <h3 className="font-medium text-lg mb-4">{t('landing.footer.navigation')}</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">{t('nav.dashboard')}</Link>
                <Link to="/journal" className="text-sm text-muted-foreground hover:text-primary">{t('nav.journal')}</Link>
                <Link to="/statistics" className="text-sm text-muted-foreground hover:text-primary">{t('nav.statistics')}</Link>
                <Link to="/calendar" className="text-sm text-muted-foreground hover:text-primary">{t('nav.calendar')}</Link>
                <Link to="/premium" className="text-sm text-muted-foreground hover:text-primary">{t('landing.pricing')}</Link>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary">{t('landing.blog')}</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">{t('landing.footer.about')}</h3>
              <div className="flex flex-col gap-2">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">{t('landing.team')}</Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">{t('landing.contact')}</Link>
                <Link to="/premium" className="text-sm text-muted-foreground hover:text-primary">{t('landing.pricing')}</Link>
                <Link to="/demo" className="text-sm text-muted-foreground hover:text-primary">{t('landing.demo')}</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">{t('landing.footer.legal')}</h3>
              <div className="flex flex-col gap-2">
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">{t('landing.footer.terms')}</Link>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">{t('landing.footer.privacy')}</Link>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary">{t('landing.footer.cookies')}</Link>
                <Link to="/mentions" className="text-sm text-muted-foreground hover:text-primary">{t('landing.footer.mentions')}</Link>
              </div>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('landing.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
