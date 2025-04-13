
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  BarChart3, 
  Book, 
  Wallet, 
  Contact, 
  Settings, 
  Home, 
  ChevronLeft,
  ChevronRight,
  X
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
  
  useEffect(() => {
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) {
      setCollapsed(JSON.parse(storedState));
    } else {
      setCollapsed(isMobile);
    }

    const handleSidebarToggleEvent = (e: CustomEvent) => {
      setCollapsed(e.detail.collapsed);
    };
    
    window.addEventListener('sidebar-toggle', handleSidebarToggleEvent as EventListener);
    
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggleEvent as EventListener);
    };
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

  const handleNavItemClick = () => {
    if (isMobile && !collapsed) {
      toggleSidebar();
    }
  };

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

  const filteredNavItems = navItems;

  const sidebarClasses = cn(
    'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-sidebar border-r border-sidebar-border',
    collapsed ? "w-0 md:w-16" : "w-64",
    isMobile && collapsed ? "-translate-x-full" : "translate-x-0",
    isMobile ? "pt-14" : "pt-0"
  );

  const contentVisible = !(isMobile && collapsed);

  return (
    <aside 
      className={sidebarClasses} 
      id="sidebar" 
      role="navigation" 
      aria-label="Navigation principale"
    >
      {contentVisible && (
        <div className="flex h-full flex-col">
          {!isMobile && (
            <div className="flex items-center justify-between px-3 py-3 border-b border-sidebar-border">
              {!collapsed && (
                <Link 
                  to="/" 
                  className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                  aria-label="Accueil"
                >
                  <img 
                    src="/lovable-uploads/8805ed74-f29b-43c2-a317-b0c60214c441.png" 
                    alt="Trades Tracker Logo" 
                    className={cn(
                      "h-8 w-auto object-contain", 
                      collapsed ? "hidden" : "block"
                    )} 
                  />
                </Link>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className={cn(
                  collapsed ? "w-full" : "ml-auto",
                  "h-8 w-8 focus-visible:ring-2 focus-visible:ring-primary"
                )}
                aria-label={collapsed ? "Développer le menu" : "Réduire le menu"}
                aria-expanded={!collapsed}
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          )}

          {isMobile && (
            <div className="sticky top-0 flex justify-end px-3 py-2 bg-background/80 backdrop-blur-sm z-10 border-b border-sidebar-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-primary rounded-full"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          )}

          <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
            <ul className="space-y-3 px-2">
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
      )}
    </aside>
  );
}
