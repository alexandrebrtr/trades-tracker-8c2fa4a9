
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
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          ? 'bg-white/80 dark:bg-background/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 z-10">
            <img 
              src="/public/lovable-uploads/80ba05ae-ec00-4477-935d-9995a8a7fb48.png" 
              alt="Trades Tracker Logo" 
              className="h-8 w-auto"
            />
            <span className="text-primary font-semibold text-xl">
              Trades Tracker
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                item={item} 
                isActive={location.pathname === item.path} 
              />
            ))}
          </nav>

          {/* Mobile Navigation Trigger */}
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-12">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors',
                        location.pathname === item.path 
                          ? 'bg-primary text-white' 
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}

          {/* User Menu (Simplified) */}
          <div className="flex items-center">
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-secondary transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                T
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </button>
          </div>
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
