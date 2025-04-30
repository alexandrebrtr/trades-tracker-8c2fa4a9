import React, { createContext, useContext, useState, useCallback } from 'react';

interface LanguageContextProps {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function useLanguage(): LanguageContextProps {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const changeLanguage = useCallback((lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  }, []);

  const t = useCallback((key: string, vars: Record<string, string> = {}) => {
    let translation = translations[language]?.[key] || translations['en'][key] || key;
    
    for (const varKey in vars) {
      translation = translation.replace(new RegExp(`{${varKey}}`, 'g'), vars[varKey]);
    }

    return translation;
  }, [language]);

  // Translation data
  const translations: Record<string, Record<string, string>> = {
    en: {
      "common.darkMode": "Dark Mode",
      "common.lightMode": "Light Mode",
      "common.user": "User",
      "common.error": "Error",
      "common.cancel": "Cancel",
      "auth.login": "Login",
      "auth.logout": "Logout",
      "header.siteHeader": "Site Header",
      "header.userMenu": "User Menu",
      "header.avatarAlt": "Avatar of",
      "user.profile": "Profile",
      "user.settings": "Settings",
      "nav.dashboard": "Dashboard",
      "nav.journal": "Journal",
      "nav.calendar": "Calendar",
      "nav.statistics": "Statistics",
      "nav.tradeEntry": "Trade Entry",
      "nav.settings": "Settings",
      "nav.blog": "Blog",
      "nav.team": "Team",
      "nav.contact": "Contact",
      "nav.premium": "Premium",
      "nav.home": "Home",
      "nav.collapseSidebar": "Collapse Sidebar",
      "nav.expandSidebar": "Expand Sidebar",
      "landing.dashboard": "Dashboard",
      "team.title": "Our Team",
      "team.subtitle": "Meet the people behind TradesTracker",
      "blog.title": "Blog",
      "blog.subtitle": "Insights and articles about trading and finance",
      "blog.all": "All",
      "blog.trading": "Trading",
      "blog.analysis": "Analysis",
      "blog.psychology": "Psychology",
      "blog.education": "Education",
      "blog.readMore": "Read More",
      "blog.postNotFound": "Post not found",
      "blog.backToBlog": "Back to Blog",
      "blog.shareBlogPost": "Share this post",
      "trade.date": "Date",
      "trade.asset": "Asset",
      "trade.type": "Type",
      "trade.entryPrice": "Entry Price",
      "trade.exitPrice": "Exit Price",
      "trade.size": "Size",
      "trade.pnl": "P&L",
      "trade.long": "Long",
      "trade.short": "Short",
      "dashboard.recentTrades": "Recent Trades",
      "dashboard.noTrades": "No trades recorded yet.",
      "journal.tradeDeleted": "Trade Deleted",
      "journal.tradeDeletedSuccess": "The trade has been successfully deleted.",
      "journal.deleteError": "An error occurred while deleting the trade.",
      "journal.deleteAllTrades": "Delete All Trades",
      "journal.deleteAllTitle": "Delete All Trades",
      "journal.deleteAllDescription": "This action will permanently delete all your trades and cannot be undone.",
      "journal.deleteAllWarning": "This will remove ALL of your trade history and performance data.",
      "journal.confirmDeleteAll": "Type {confirmText} to confirm deletion",
      "journal.allTradesDeleted": "All Trades Deleted",
      "journal.allTradesDeletedSuccess": "All your trades have been successfully deleted",
      "journal.deleteAllError": "An error occurred while deleting all trades",
    },
    fr: {
      "common.darkMode": "Mode Sombre",
      "common.lightMode": "Mode Clair",
      "common.user": "Utilisateur",
      "common.error": "Erreur",
      "common.cancel": "Annuler",
      "auth.login": "Se connecter",
      "auth.logout": "Déconnexion",
      "header.siteHeader": "En-tête du Site",
      "header.userMenu": "Menu Utilisateur",
      "header.avatarAlt": "Avatar de",
      "user.profile": "Profil",
      "user.settings": "Paramètres",
      "nav.dashboard": "Tableau de Bord",
      "nav.journal": "Journal",
      "nav.calendar": "Calendrier",
      "nav.statistics": "Statistiques",
      "nav.tradeEntry": "Nouvel Trade",
      "nav.settings": "Paramètres",
      "nav.blog": "Blog",
      "nav.team": "Équipe",
      "nav.contact": "Contact",
      "nav.premium": "Premium",
      "nav.home": "Accueil",
      "nav.collapseSidebar": "Réduire la barre latérale",
      "nav.expandSidebar": "Développer la barre latérale",
      "landing.dashboard": "Tableau de bord",
      "team.title": "Notre Équipe",
      "team.subtitle": "Rencontrez les personnes derrière TradesTracker",
      "blog.title": "Blog",
      "blog.subtitle": "Articles et réflexions sur le trading et la finance",
      "blog.all": "Tous",
      "blog.trading": "Trading",
      "blog.analysis": "Analyse",
      "blog.psychology": "Psychologie",
      "blog.education": "Éducation",
      "blog.readMore": "Lire Plus",
      "blog.postNotFound": "Article non trouvé",
      "blog.backToBlog": "Retour au Blog",
      "blog.shareBlogPost": "Partager cet article",
      "trade.date": "Date",
      "trade.asset": "Actif",
      "trade.type": "Type",
      "trade.entryPrice": "Prix d'entrée",
      "trade.exitPrice": "Prix de sortie",
      "trade.size": "Taille",
      "trade.pnl": "P&L",
      "trade.long": "Long",
      "trade.short": "Short",
      "dashboard.recentTrades": "Trades Récents",
      "dashboard.noTrades": "Aucun trade enregistré pour le moment.",
      "journal.tradeDeleted": "Trade Supprimé",
      "journal.tradeDeletedSuccess": "Le trade a été supprimé avec succès.",
      "journal.deleteError": "Une erreur est survenue lors de la suppression du trade.",
      "journal.deleteAllTrades": "Supprimer tous les trades",
      "journal.deleteAllTitle": "Supprimer tous les trades",
      "journal.deleteAllDescription": "Cette action supprimera définitivement tous vos trades et ne peut pas être annulée.",
      "journal.deleteAllWarning": "Cela supprimera TOUT votre historique de trades et vos données de performance.",
      "journal.confirmDeleteAll": "Tapez {confirmText} pour confirmer la suppression",
      "journal.allTradesDeleted": "Tous les trades supprimés",
      "journal.allTradesDeletedSuccess": "Tous vos trades ont été supprimés avec succès",
      "journal.deleteAllError": "Une erreur est survenue lors de la suppression de tous les trades",
    },
  };

  const value = {
    language,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageContext;
