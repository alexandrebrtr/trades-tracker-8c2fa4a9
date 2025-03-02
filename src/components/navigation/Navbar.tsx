
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
  ChevronDown
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Update scrolled state based on window scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      name: 'Calendrier',
      path: '/calendar',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      name: 'Nouveau Trade',
      path: '/trade-entry',
      icon: <PlusCircle className="w-4 h-4" />
    },
    {
      name: 'Statistiques',
      path: '/statistics',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      name: 'Journal',
      path: '/journal',
      icon: <Book className="w-4 h-4" />
    },
    {
      name: 'Paramètres',
      path: '/settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300', 
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-primary font-semibold text-xl">
              Trades Tracker
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                item={item} 
                isActive={location.pathname === item.path} 
              />
            ))}
          </nav>

          {/* User Menu (Simplified) */}
          <div className="flex items-center">
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-secondary transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                T
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.slice(0, 5).map((item) => (
            <MobileNavLink 
              key={item.path} 
              item={item} 
              isActive={location.pathname === item.path} 
            />
          ))}
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
}

function NavLink({ item, isActive }: NavLinkProps) {
  return (
    <Link
      to={item.path}
      className={cn(
        'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive 
          ? 'bg-primary text-white' 
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
    >
      {item.icon}
      <span>{item.name}</span>
    </Link>
  );
}

function MobileNavLink({ item, isActive }: NavLinkProps) {
  return (
    <Link
      to={item.path}
      className={cn(
        'flex flex-col items-center justify-center px-1 py-2 rounded-md text-xs font-medium transition-colors',
        isActive 
          ? 'text-primary' 
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <div className={cn(
        'p-1.5 rounded-full mb-1',
        isActive ? 'bg-primary/10' : ''
      )}>
        {item.icon}
      </div>
      <span>{item.name}</span>
    </Link>
  );
}
