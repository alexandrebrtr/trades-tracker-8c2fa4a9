
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages
export type Language = 'fr' | 'en';

// Define the context shape
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Create translations for each language
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.calendar': 'Calendrier',
    'nav.newTrade': 'Nouveau Trade',
    'nav.statistics': 'Statistiques',
    'nav.journal': 'Journal',
    'nav.settings': 'Paramètres',
    
    // Landing page header
    'landing.features': 'Fonctionnalités',
    'landing.pricing': 'Tarifs',
    'landing.resources': 'Ressources',
    'landing.about': 'À propos',
    'landing.blog': 'Blog',
    'landing.faq': 'FAQ',
    'landing.demo': 'Démonstration',
    'landing.team': 'Notre équipe',
    'landing.contact': 'Nous contacter',
    'landing.login': 'Connexion',
    'landing.signup': 'S\'inscrire',
    
    // Header
    'header.siteHeader': 'En-tête du site',
    'header.userMenu': 'Menu utilisateur',
    'header.avatarAlt': 'Avatar de',
    
    // Blog
    'blog.title': 'Blog',
    'blog.subtitle': 'Des articles et analyses pour améliorer votre trading et la gestion de votre portefeuille',
    'blog.readTime': 'min de lecture',
    'blog.readArticle': 'Lire l\'article',
    'blog.by': 'Par',
    'blog.newArticles': 'De nouveaux articles sont publiés chaque semaine. Revenez bientôt !',
    
    // Team
    'team.title': 'Notre Équipe',
    'team.subtitle': 'Une équipe passionnée dédiée à votre réussite en trading',
    
    // Auth
    'auth.login': 'Connexion',
    'auth.signup': 'S\'inscrire',
    'auth.logout': 'Déconnexion',
    
    // User menu
    'user.profile': 'Profil',
    'user.settings': 'Paramètres',
    'user.account': 'Mon compte',
    
    // Common
    'common.lightMode': 'Mode clair',
    'common.darkMode': 'Mode sombre',
    'common.user': 'Utilisateur',
    
    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.overview': 'Vue d\'ensemble de vos performances de trading',
    'dashboard.demo': 'Vous consultez une démo. Connectez-vous pour voir vos données réelles.',
    'dashboard.login': 'Se connecter / S\'inscrire',
    'dashboard.currentBalance': 'Solde actuel',
    'dashboard.monthlyPnL': 'P&L Mensuel',
    'dashboard.loading': 'Chargement de votre tableau de bord...',
    'dashboard.performance': 'Performance du compte',
    'dashboard.recentTrades': 'Trades récents',
    'dashboard.noTrades': 'Aucun trade enregistré. Commencez à ajouter vos trades dans la section "Ajouter un trade".',
    
    // Trade table
    'trade.date': 'Date',
    'trade.asset': 'Actif',
    'trade.type': 'Type',
    'trade.entryPrice': 'Prix d\'entrée',
    'trade.exitPrice': 'Prix de sortie',
    'trade.size': 'Taille',
    'trade.pnl': 'P&L',
    'trade.long': 'Long',
    'trade.short': 'Short',
    
    // Landing page
    'landing.hero.title': 'Suivez, Optimisez, Tradez.',
    'landing.hero.description': 'Trades Tracker est l\'application qui vous aide à mieux gérer votre trading. Suivez vos performances, analysez vos trades et optimisez votre stratégie.',
    'landing.hero.cta': 'Démarrer gratuitement',
    'landing.stats.activeTraders': 'Traders actifs',
    'landing.stats.analyzedTrades': 'Trades analysés',
    'landing.stats.satisfaction': 'Taux de satisfaction',
    
    'landing.features.title': 'Toutes les fonctionnalités dont vous avez besoin',
    'landing.features.subtitle': 'Une suite complète d\'outils pour optimiser votre trading',
    'landing.features.journal': 'Journal de trading',
    'landing.features.journalDesc': 'Enregistrez vos trades et analysez vos performances avec +20 métriques',
    'landing.features.technical': 'Analyse technique',
    'landing.features.technicalDesc': 'Suivez vos stratégies et identifiez vos points forts',
    'landing.features.capital': 'Gestion du capital',
    'landing.features.capitalDesc': 'Optimisez votre money management et limitez les risques',
    'landing.features.stats': 'Statistiques avancées',
    'landing.features.statsDesc': 'Visualisez vos performances avec des graphiques détaillés',
    'landing.features.calendar': 'Calendrier trading',
    'landing.features.calendarDesc': 'Planifiez et suivez vos sessions de trading efficacement',
    'landing.features.comparative': 'Statistiques comparatives',
    'landing.features.comparativeDesc': 'Comparez vos performances avec d\'autres traders',
    
    'landing.blog.section': 'Blog Trading',
    'landing.blog.title': 'Découvrez nos articles sur le trading',
    'landing.blog.description': 'Apprenez de l\'expérience des meilleurs traders et restez informé des dernières tendances du marché',
    'landing.blog.button': 'Accéder au blog',
    
    'landing.testimonials.title': 'Ce que disent nos utilisateurs',
    'landing.testimonials.subtitle': 'Découvrez comment Trades Tracker aide les traders à améliorer leurs performances',
    
    'landing.contact.title': 'Une question ? Contactez-nous',
    'landing.contact.subtitle': 'Notre équipe est disponible pour répondre à toutes vos questions sur Trades Tracker',
    
    'landing.beta.title': 'Version Bêta - Premium Offert !',
    'landing.beta.description': 'Vous utilisez actuellement la version bêta de Trades Tracker. Pendant cette période, nous offrons l\'accès premium gratuitement à tous nos utilisateurs !',
    'landing.beta.note': 'Pour en bénéficier, il vous suffit d\'envoyer un message via notre page contact en précisant votre intérêt pour l\'accès premium gratuit.',
    'landing.beta.contactButton': 'Contacter l\'équipe',
    
    'landing.warning.title': 'Avertissement important',
    'landing.warning.risk': 'Le trading et les investissements sur les marchés financiers comportent un risque substantiel de perte. Les performances passées ne préjugent pas des résultats futurs.',
    'landing.warning.lossRate': '75% des comptes d\'investisseurs particuliers perdent de l\'argent lorsqu\'ils négocient des produits financiers.',
    'landing.warning.purpose': 'Cette plateforme est conçue pour le suivi et l\'analyse de vos activités de trading, et non pour fournir des recommandations d\'investissement. Veuillez consulter un conseiller financier professionnel avant de prendre des décisions d\'investissement.',
    
    'landing.cta.title': 'Prêt à transformer votre trading ?',
    'landing.cta.subtitle': 'Rejoignez des milliers de traders qui ont amélioré leurs performances grâce à Trades Tracker.',
    'landing.cta.button': 'Commencer gratuitement',
    
    'landing.footer.slogan': 'Votre compagnon de trading au quotidien',
    'landing.footer.rateUs': 'Notez notre application',
    'landing.footer.thanks': 'Merci pour votre note de {rating}/5 !',
    'landing.footer.basedOn': 'basé sur {count} avis',
    'landing.footer.navigation': 'Navigation',
    'landing.footer.about': 'À propos',
    'landing.footer.legal': 'Légal',
    'landing.footer.terms': 'Conditions d\'utilisation',
    'landing.footer.privacy': 'Politique de confidentialité',
    'landing.footer.cookies': 'Gestion des cookies',
    'landing.footer.mentions': 'Mentions légales',
    'landing.footer.copyright': '© 2025 Trades Tracker. Tous droits réservés.',
    
    // Testimonials
    'testimonials.loading': 'Chargement des témoignages...',
    'testimonials.alex': 'Trades Tracker a transformé ma façon d\'analyser mes performances. Je peux maintenant identifier facilement mes schémas de trading gagnants.',
    'testimonials.marie': 'Interface intuitive, statistiques claires. Exactement ce dont j\'avais besoin pour progresser et être plus disciplinée dans mes trades.',
    'testimonials.thomas': 'Le journal de trading est devenu mon meilleur allié. Je comprends mieux mes erreurs et améliore constamment ma stratégie.',
    'testimonials.sophie': 'Après avoir testé plusieurs outils, Trades Tracker est définitivement le plus complet. Les fonctionnalités premium valent vraiment l\'investissement.',
    'testimonials.alexRole': 'Day Trader',
    'testimonials.marieRole': 'Investisseur particulier',
    'testimonials.thomasRole': 'Swing Trader',
    'testimonials.sophieRole': 'Trader Forex',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.calendar': 'Calendar',
    'nav.newTrade': 'New Trade',
    'nav.statistics': 'Statistics',
    'nav.journal': 'Journal',
    'nav.settings': 'Settings',
    
    // Landing page header
    'landing.features': 'Features',
    'landing.pricing': 'Pricing',
    'landing.resources': 'Resources',
    'landing.about': 'About',
    'landing.blog': 'Blog',
    'landing.faq': 'FAQ',
    'landing.demo': 'Demo',
    'landing.team': 'Our Team',
    'landing.contact': 'Contact Us',
    'landing.login': 'Login',
    'landing.signup': 'Sign Up',
    
    // Header
    'header.siteHeader': 'Site header',
    'header.userMenu': 'User menu',
    'header.avatarAlt': 'Avatar of',
    
    // Blog
    'blog.title': 'Blog',
    'blog.subtitle': 'Articles and analyses to improve your trading and portfolio management',
    'blog.readTime': 'min read',
    'blog.readArticle': 'Read article',
    'blog.by': 'By',
    'blog.newArticles': 'New articles are published every week. Check back soon!',
    
    // Team
    'team.title': 'Our Team',
    'team.subtitle': 'A passionate team dedicated to your trading success',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    
    // User menu
    'user.profile': 'Profile',
    'user.settings': 'Settings',
    'user.account': 'My account',
    
    // Common
    'common.lightMode': 'Light Mode',
    'common.darkMode': 'Dark Mode',
    'common.user': 'User',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.overview': 'Overview of your trading performance',
    'dashboard.demo': 'You are viewing a demo. Log in to see your real data.',
    'dashboard.login': 'Login / Sign Up',
    'dashboard.currentBalance': 'Current Balance',
    'dashboard.monthlyPnL': 'Monthly P&L',
    'dashboard.loading': 'Loading your dashboard...',
    'dashboard.performance': 'Account Performance',
    'dashboard.recentTrades': 'Recent Trades',
    'dashboard.noTrades': 'No trades recorded. Start adding your trades in the "Add Trade" section.',
    
    // Trade table
    'trade.date': 'Date',
    'trade.asset': 'Asset',
    'trade.type': 'Type',
    'trade.entryPrice': 'Entry Price',
    'trade.exitPrice': 'Exit Price',
    'trade.size': 'Size',
    'trade.pnl': 'P&L',
    'trade.long': 'Long',
    'trade.short': 'Short',
    
    // Landing page
    'landing.hero.title': 'Track, Optimize, Trade.',
    'landing.hero.description': 'Trades Tracker is the app that helps you better manage your trading. Track your performance, analyze your trades, and optimize your strategy.',
    'landing.hero.cta': 'Start for free',
    'landing.stats.activeTraders': 'Active traders',
    'landing.stats.analyzedTrades': 'Analyzed trades',
    'landing.stats.satisfaction': 'Satisfaction rate',
    
    'landing.features.title': 'All the features you need',
    'landing.features.subtitle': 'A complete suite of tools to optimize your trading',
    'landing.features.journal': 'Trading Journal',
    'landing.features.journalDesc': 'Record your trades and analyze your performance with +20 metrics',
    'landing.features.technical': 'Technical Analysis',
    'landing.features.technicalDesc': 'Track your strategies and identify your strengths',
    'landing.features.capital': 'Capital Management',
    'landing.features.capitalDesc': 'Optimize your money management and limit risks',
    'landing.features.stats': 'Advanced Statistics',
    'landing.features.statsDesc': 'Visualize your performance with detailed charts',
    'landing.features.calendar': 'Trading Calendar',
    'landing.features.calendarDesc': 'Plan and track your trading sessions efficiently',
    'landing.features.comparative': 'Comparative Statistics',
    'landing.features.comparativeDesc': 'Compare your performance with other traders',
    
    'landing.blog.section': 'Trading Blog',
    'landing.blog.title': 'Discover our articles about trading',
    'landing.blog.description': 'Learn from the experience of the best traders and stay informed about the latest market trends',
    'landing.blog.button': 'Go to blog',
    
    'landing.testimonials.title': 'What our users say',
    'landing.testimonials.subtitle': 'Discover how Trades Tracker helps traders improve their performance',
    
    'landing.contact.title': 'Have a question? Contact us',
    'landing.contact.subtitle': 'Our team is available to answer all your questions about Trades Tracker',
    
    'landing.beta.title': 'Beta Version - Premium Offered!',
    'landing.beta.description': 'You are currently using the beta version of Trades Tracker. During this period, we are offering premium access for free to all our users!',
    'landing.beta.note': 'To benefit, simply send a message via our contact page specifying your interest in free premium access.',
    'landing.beta.contactButton': 'Contact the team',
    
    'landing.warning.title': 'Important warning',
    'landing.warning.risk': 'Trading and investing in financial markets involve substantial risk of loss. Past performance is not indicative of future results.',
    'landing.warning.lossRate': '75% of retail investor accounts lose money when trading financial products.',
    'landing.warning.purpose': 'This platform is designed for tracking and analyzing your trading activities, not to provide investment recommendations. Please consult a professional financial advisor before making investment decisions.',
    
    'landing.cta.title': 'Ready to transform your trading?',
    'landing.cta.subtitle': 'Join thousands of traders who have improved their performance with Trades Tracker.',
    'landing.cta.button': 'Start for free',
    
    'landing.footer.slogan': 'Your daily trading companion',
    'landing.footer.rateUs': 'Rate our application',
    'landing.footer.thanks': 'Thank you for your {rating}/5 rating!',
    'landing.footer.basedOn': 'based on {count} reviews',
    'landing.footer.navigation': 'Navigation',
    'landing.footer.about': 'About',
    'landing.footer.legal': 'Legal',
    'landing.footer.terms': 'Terms of Use',
    'landing.footer.privacy': 'Privacy Policy',
    'landing.footer.cookies': 'Cookie Management',
    'landing.footer.mentions': 'Legal Notice',
    'landing.footer.copyright': '© 2025 Trades Tracker. All rights reserved.',
    
    // Testimonials
    'testimonials.loading': 'Loading testimonials...',
    'testimonials.alex': 'Trades Tracker has transformed the way I analyze my performance. I can now easily identify my winning trading patterns.',
    'testimonials.marie': 'Intuitive interface, clear statistics. Exactly what I needed to progress and be more disciplined in my trades.',
    'testimonials.thomas': 'The trading journal has become my best ally. I better understand my mistakes and constantly improve my strategy.',
    'testimonials.sophie': 'After testing several tools, Trades Tracker is definitely the most complete. The premium features are truly worth the investment.',
    'testimonials.alexRole': 'Day Trader',
    'testimonials.marieRole': 'Retail Investor',
    'testimonials.thomasRole': 'Swing Trader',
    'testimonials.sophieRole': 'Forex Trader',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with browser language or default to French
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'fr';
  };
  
  const [language, setLanguageState] = useState<Language>(() => {
    // Check for saved language preference
    const savedLang = localStorage.getItem('language');
    return (savedLang as Language) || getBrowserLanguage();
  });
  
  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);
  
  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  // Set language function
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };
  
  const value = {
    language,
    setLanguage,
    t,
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
