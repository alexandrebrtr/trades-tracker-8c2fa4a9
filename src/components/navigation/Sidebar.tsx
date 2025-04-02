
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  BarChart3, 
  Book, 
  Menu,
  X,
  Wallet,
  Contact,
  Settings,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarUserSection } from './SidebarUserSection';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  requirePremium?: boolean;
}

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Initialize sidebar state
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) {
      setCollapsed(JSON.parse(storedState));
    } else {
      setCollapsed(isMobile);
    }
  }, [isMobile]);

  // Amélioration du comportement de scroll sur mobile
  useEffect(() => {
    if (!isMobile) return;
    
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let ticking = false;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      
      if (!ticking && currentTime - lastScrollTime > 100) {
        window.requestAnimationFrame(() => {
          // Masquer sidebar quand on scrolle vers le bas, montrer quand on scrolle vers le haut
          if (currentScrollY > lastScrollY + 10) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY - 10) {
            setIsVisible(true);
          }
          
          lastScrollY = currentScrollY;
          lastScrollTime = currentTime;
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    
    const event = new CustomEvent('sidebar-toggle', { 
      detail: { collapsed: newState } 
    });
    window.dispatchEvent(event);
  };

  // Callback pour fermer la sidebar sur mobile après clic sur un item
  const handleNavItemClick = () => {
    if (isMobile && !collapsed) {
      toggleSidebar();
    }
  };

  // Ne pas afficher la sidebar sur certaines routes mobiles
  if (isMobile && !location.pathname.includes('/dashboard') && 
      !location.pathname.includes('/statistics') && 
      !location.pathname.includes('/trade-entry') && 
      !location.pathname.includes('/calendar') && 
      !location.pathname.includes('/journal') && 
      !location.pathname.includes('/portfolio') && 
      !location.pathname.includes('/settings')) {
    return null;
  }

  const navItems: NavItem[] = [
    {
      name: 'Accueil',
      path: '/',
      icon: <Home className="w-5 h-5" aria-hidden="true" />
    },
    {
      name: 'Tableau de bord',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
    },
    {
      name: 'Calendrier',
      path: '/calendar',
      icon: <Calendar className="w-5 h-5" aria-hidden="true" />,
      requirePremium: true
    },
    {
      name: 'Nouveau Trade',
      path: '/trade-entry',
      icon: <PlusCircle className="w-5 h-5" aria-hidden="true" />
    },
    {
      name: 'Portefeuille',
      path: '/portfolio',
      icon: <Wallet className="w-5 h-5" aria-hidden="true" />
    },
    {
      name: 'Statistiques',
      path: '/statistics',
      icon: <BarChart3 className="w-5 h-5" aria-hidden="true" />,
      requirePremium: true
    },
    {
      name: 'Journal',
      path: '/journal',
      icon: <Book className="w-5 h-5" aria-hidden="true" />
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: <Contact className="w-5 h-5" aria-hidden="true" />
    },
    {
      name: 'Paramètres',
      path: '/settings',
      icon: <Settings className="w-5 h-5" aria-hidden="true" />
    }
  ];

  // Montrer tous les éléments de navigation
  const filteredNavItems = navItems;

  // Déterminer les classes CSS en fonction de l'état mobile et de la visibilité
  const sidebarClasses = cn(
    'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-sidebar border-r border-sidebar-border',
    collapsed ? "w-0 md:w-20 -translate-x-full md:translate-x-0" : "w-64",
    isMobile && !isVisible ? "-translate-y-full" : "translate-y-0",
    // Overlay en mode mobile quand sidebar est ouverte
    isMobile && !collapsed ? "shadow-xl" : ""
  );

  return (
    <>
      {/* Overlay sombre en arrière-plan lors de l'ouverture sidebar mobile */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={sidebarClasses} 
        id="sidebar" 
        role="navigation" 
        aria-label="Navigation principale"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
            {!collapsed && (
              <Link 
                to="/" 
                className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                aria-label="Accueil"
              >
                <span className="text-primary font-bold text-xl">Trades Tracker</span>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className={cn(
                collapsed ? "w-full" : "ml-auto",
                isMobile && "p-2 h-auto",
                "focus-visible:ring-2 focus-visible:ring-primary"
              )}
              aria-label={collapsed ? "Développer le menu" : "Réduire le menu"}
              aria-expanded={!collapsed}
            >
              {collapsed ? <Menu className="h-5 w-5" aria-hidden="true" /> : <X className="h-5 w-5" aria-hidden="true" />}
            </Button>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
            <ul className="space-y-2 px-2">
              {filteredNavItems.map((item) => (
                <SidebarNavItem 
                  key={item.path}
                  name={item.name}
                  path={item.path}
                  icon={item.icon}
                  collapsed={collapsed}
                  isPremiumFeature={item.requirePremium}
                  userHasPremium={isPremium}
                  onItemClick={handleNavItemClick}
                />
              ))}
            </ul>
          </nav>

          <SidebarUserSection collapsed={collapsed} onUserAction={handleNavItemClick} />
        </div>
      </aside>
    </>
  );
}
