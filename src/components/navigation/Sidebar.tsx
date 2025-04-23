import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  BarChart3, 
  Book, 
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  FileText,
  Wallet,
  ChevronDown,
  Contact
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarUserSection } from './SidebarUserSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NavGroup {
  name: string;
  icon: React.ReactNode;
  items: NavItem[];
}

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
  
  // État pour gérer les menus déroulants
  const [openPersonnel, setOpenPersonnel] = useState(false);
  const [openAnalyses, setOpenAnalyses] = useState(false);

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

  const mainNavItems: NavItem[] = [
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
  ];

  const personnelItems: NavItem[] = [
    {
      name: 'Profil',
      path: '/profile',
      icon: <User className="w-5 h-5" aria-hidden="true" />
    },
    {
      name: 'Portefeuille',
      path: '/portfolio',
      icon: <Wallet className="w-5 h-5" aria-hidden="true" />
    },
    {
      name: 'Paramètres',
      path: '/settings',
      icon: <Settings className="w-5 h-5" aria-hidden="true" />
    },
  ];

  const analysesItems: NavItem[] = [
    {
      name: 'Calendrier',
      path: '/calendar',
      icon: <Calendar className="w-5 h-5" aria-hidden="true" />,
      requirePremium: true
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
      icon: <FileText className="w-5 h-5" aria-hidden="true" />
    },
  ];

  const afterGroupsItems: NavItem[] = [
    {
      name: 'Nouveau Trade',
      path: '/trade-entry',
      icon: <PlusCircle className="w-5 h-5" aria-hidden="true" />
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: <Contact className="w-5 h-5" aria-hidden="true" />
    },
  ];

  // Fonction pour rendre un groupe de navigation déroulant
  const renderCollapsibleGroup = (
    title: string, 
    items: NavItem[], 
    isOpen: boolean, 
    setIsOpen: (open: boolean) => void,
    icon: React.ReactNode
  ) => {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center w-full px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground gap-2">
          {icon}
          {!collapsed && (
            <>
              <span className="flex-1 text-sm font-medium">{title}</span>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen ? "transform rotate-180" : ""
              )} />
            </>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="mt-1 space-y-1">
            {items.map((item) => (
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
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <aside 
      className={cn(
        'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-sidebar border-r border-sidebar-border',
        collapsed ? "w-0 md:w-16" : "w-64",
        isMobile && collapsed ? "-translate-x-full" : "translate-x-0",
        isMobile ? "pt-14" : "pt-0"
      )}
      id="sidebar" 
      role="navigation" 
      aria-label="Navigation principale"
    >
      {!(isMobile && collapsed) && (
        <div className="flex h-full flex-col">
          {!isMobile && (
            <div className="flex items-center justify-between px-3 py-3 border-b border-sidebar-border">
              {!collapsed && (
                <Link 
                  to="/" 
                  className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                  aria-label="Accueil"
                >
                  <span className="text-primary font-bold text-lg truncate">Trades Tracker</span>
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
              {/* Menu principal */}
              {mainNavItems.map((item) => (
                <SidebarNavItem
                  key={item.path}
                  {...item}
                  collapsed={collapsed}
                  onItemClick={handleNavItemClick}
                />
              ))}
              
              {/* Personnel - Menu déroulant */}
              <li>
                {renderCollapsibleGroup(
                  'Personnel',
                  personnelItems,
                  openPersonnel,
                  setOpenPersonnel,
                  <User className="w-5 h-5" aria-hidden="true" />
                )}
              </li>

              {/* Items du milieu */}
              {afterGroupsItems.slice(0, 1).map((item) => (
                <SidebarNavItem
                  key={item.path}
                  {...item}
                  collapsed={collapsed}
                  onItemClick={handleNavItemClick}
                />
              ))}

              {/* Analyses - Menu déroulant */}
              <li>
                {renderCollapsibleGroup(
                  'Analyses',
                  analysesItems,
                  openAnalyses,
                  setOpenAnalyses,
                  <BarChart3 className="w-5 h-5" aria-hidden="true" />
                )}
              </li>

              {/* Dernier item (Contact) */}
              {afterGroupsItems.slice(1).map((item) => (
                <SidebarNavItem
                  key={item.path}
                  {...item}
                  collapsed={collapsed}
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
