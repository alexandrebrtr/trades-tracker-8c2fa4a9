
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
  Contact,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarUserSection } from './SidebarUserSection';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    const storedAccordions = localStorage.getItem('sidebarOpenAccordions');
    if (storedAccordions) {
      try {
        setOpenAccordions(JSON.parse(storedAccordions));
      } catch (e) {
        console.error("Erreur lors du chargement des accordéons ouverts:", e);
      }
    }
  }, []);

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

  const handleAccordionChange = (value: string) => {
    const newOpenState = { ...openAccordions };
    newOpenState[value] = !newOpenState[value];
    setOpenAccordions(newOpenState);
    localStorage.setItem('sidebarOpenAccordions', JSON.stringify(newOpenState));
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
      name: 'Abonnement premium',
      path: '/premium',
      icon: <CreditCard className="w-5 h-5" aria-hidden="true" />
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
      name: 'Contact',
      path: '/contact',
      icon: <Contact className="w-5 h-5" aria-hidden="true" />
    },
  ];

  const newTradeItem: NavItem = {
    name: 'Nouveau Trade',
    path: '/trade-entry',
    icon: <PlusCircle className="w-5 h-5" aria-hidden="true" />
  };

  const renderAccordionGroup = (
    title: string, 
    items: NavItem[], 
    icon: React.ReactNode,
    value: string
  ) => {
    if (collapsed) {
      return (
        <div className="relative group">
          <button
            className="flex items-center justify-center w-full px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => handleAccordionChange(value)}
            aria-label={`Menu ${title}`}
          >
            {icon}
          </button>
          {openAccordions[value] && (
            <div className="absolute left-full top-0 ml-2 w-48 py-2 bg-popover border rounded-md shadow-md z-50">
              {items.map((item) => (
                <SidebarNavItem
                  key={item.path}
                  name={item.name}
                  path={item.path}
                  icon={item.icon}
                  collapsed={false}
                  isPremiumFeature={item.requirePremium}
                  userHasPremium={isPremium}
                  onItemClick={handleNavItemClick}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <Accordion 
        type="multiple" 
        value={Object.keys(openAccordions).filter(k => openAccordions[k])}
        onValueChange={(values) => {
          if (values.includes(value)) {
            handleAccordionChange(value);
          } else {
            handleAccordionChange(value);
          }
        }}
        className="w-full border-none"
      >
        <AccordionItem value={value} className="border-none">
          <AccordionTrigger className="flex items-center w-full px-3 py-2.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div className="flex items-center gap-2 text-left">
              {icon}
              <span className="text-sm font-medium">{title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="mt-1 space-y-1.5 pl-7">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
            <ul className="space-y-1.5 px-2">
              {mainNavItems.map((item) => (
                <SidebarNavItem
                  key={item.path}
                  {...item}
                  collapsed={collapsed}
                  onItemClick={handleNavItemClick}
                />
              ))}
              
              <li>
                {renderAccordionGroup(
                  'Analyses',
                  analysesItems,
                  <BarChart3 className="w-5 h-5" aria-hidden="true" />,
                  'analyses'
                )}
              </li>

              <li>
                <SidebarNavItem
                  {...newTradeItem}
                  collapsed={collapsed}
                  onItemClick={handleNavItemClick}
                />
              </li>

              <li>
                {renderAccordionGroup(
                  'Personnel',
                  personnelItems,
                  <User className="w-5 h-5" aria-hidden="true" />,
                  'personnel'
                )}
              </li>

              {afterGroupsItems.map((item) => (
                <li key={item.path}>
                  <SidebarNavItem
                    {...item}
                    collapsed={collapsed}
                    onItemClick={handleNavItemClick}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <SidebarUserSection collapsed={collapsed} onUserAction={handleNavItemClick} />
        </div>
      )}
    </aside>
  );
}
