
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
    
    // Common
    'common.lightMode': 'Mode clair',
    'common.darkMode': 'Mode sombre',
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
    
    // Common
    'common.lightMode': 'Light Mode',
    'common.darkMode': 'Dark Mode',
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
