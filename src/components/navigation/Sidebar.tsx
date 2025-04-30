
import { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarNavItem } from './SidebarNavItem';
import { Home, BookOpen, BarChart2, Calendar, Settings, Layers, FileText, PlusCircle, Book, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SidebarUserSection } from './SidebarUserSection';
import { useLanguage } from '@/context/LanguageContext';

interface SidebarProps {
  allowAnonymous?: boolean;
}

export function Sidebar({ allowAnonymous = false }: SidebarProps) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  
  // Items to show for anonymous users
  const publicItems = [
    {
      title: t('nav.home'),
      href: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: t('nav.blog'),
      href: '/blog',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: t('nav.team'),
      href: '/team',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: t('nav.contact'),
      href: '/contact',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: t('nav.premium'),
      href: '/premium',
      icon: <Layers className="h-5 w-5" />,
    },
  ];

  // Items to show for authenticated users
  const authenticatedItems = [
    {
      title: t('nav.dashboard'),
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: t('nav.journal'),
      href: '/journal',
      icon: <Book className="h-5 w-5" />,
    },
    {
      title: t('nav.calendar'),
      href: '/calendar',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: t('nav.statistics'),
      href: '/statistics',
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: t('nav.tradeEntry'),
      href: '/trade-entry',
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      title: t('nav.settings'),
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Use the appropriate navigation items based on authentication status
  const navItems = user ? authenticatedItems : publicItems;

  useEffect(() => {
    // Load collapsed state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setCollapsed(JSON.parse(savedState));
    }
    
    // Listen for sidebar toggle events
    const handleSidebarToggle = (e: CustomEvent) => {
      setCollapsed(e.detail.collapsed);
    };
    
    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    
    // Dispatch event for other components to react
    const event = new CustomEvent('sidebar-toggle', { 
      detail: { collapsed: newState } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-background transition-all duration-300 border-r",
        collapsed ? "w-16" : "w-64",
        "md:block" // Always shown on desktop
      )}
      id="sidebar"
      aria-label="Sidebar"
      role="navigation"
    >
      <div className="h-full flex flex-col">
        {/* Logo and toggle button */}
        <div className={cn(
          "flex items-center border-b h-10",
          collapsed ? "justify-center" : "justify-between px-4"
        )}>
          {!collapsed && (
            <NavLink to="/" className="text-lg font-bold text-primary">
              TradesTracker
            </NavLink>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-muted transition-colors"
            aria-label={collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("transition-transform", collapsed ? "rotate-180" : "")}
            >
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1.5 px-2">
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={item.title}
                collapsed={collapsed}
                active={location.pathname === item.href}
              />
            ))}
          </ul>
        </nav>
        
        {/* User Section */}
        <SidebarUserSection collapsed={collapsed} />
      </div>
    </div>
  );
}

export default Sidebar;
