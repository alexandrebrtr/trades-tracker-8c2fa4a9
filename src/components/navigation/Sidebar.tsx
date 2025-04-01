
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
  
  useEffect(() => {
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) {
      setCollapsed(JSON.parse(storedState));
    } else {
      setCollapsed(isMobile);
    }
  }, [isMobile]);

  useEffect(() => {
    // Auto-collapse on mobile when navigating
    if (isMobile) {
      setCollapsed(true);
      localStorage.setItem('sidebarCollapsed', 'true');
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    
    const event = new CustomEvent('sidebar-toggle', { 
      detail: { collapsed: newState } 
    });
    window.dispatchEvent(event);
  };

  // Hide sidebar on mobile when not on /dashboard routes
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
      icon: <Home className="w-5 h-5" />
    },
    {
      name: 'Tableau de bord',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Calendrier',
      path: '/calendar',
      icon: <Calendar className="w-5 h-5" />,
      requirePremium: true
    },
    {
      name: 'Nouveau Trade',
      path: '/trade-entry',
      icon: <PlusCircle className="w-5 h-5" />
    },
    {
      name: 'Portefeuille',
      path: '/portfolio',
      icon: <Wallet className="w-5 h-5" />
    },
    {
      name: 'Statistiques',
      path: '/statistics',
      icon: <BarChart3 className="w-5 h-5" />,
      requirePremium: true
    },
    {
      name: 'Journal',
      path: '/journal',
      icon: <Book className="w-5 h-5" />
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: <Contact className="w-5 h-5" />
    },
    {
      name: 'Paramètres',
      path: '/settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  // Modification: Afficher tous les éléments de navigation, même ceux premium
  const filteredNavItems = navItems;

  return (
    <aside 
      className={cn(
        'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-sidebar border-r border-sidebar-border',
        collapsed ? "w-0 md:w-20 -translate-x-full md:translate-x-0" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/" className="flex items-center">
              <span className="text-primary font-bold text-xl">Trades Tracker</span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={collapsed ? "w-full" : "ml-auto"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-3 px-3">
            {filteredNavItems.map((item) => (
              <SidebarNavItem 
                key={item.path}
                name={item.name}
                path={item.path}
                icon={item.icon}
                collapsed={collapsed}
                isPremiumFeature={item.requirePremium}
                userHasPremium={isPremium}
              />
            ))}
          </ul>
        </nav>

        <SidebarUserSection collapsed={collapsed} />
      </div>
    </aside>
  );
}
