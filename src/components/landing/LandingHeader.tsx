
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Package, BarChart3, Calendar, Book, Phone, Users, FileText, HelpCircle, Star, Video, Menu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/context/LanguageContext";

export function LandingHeader() {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background w-full shadow-sm">
      <div className="w-full px-4 mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-semibold text-primary">
              Trades Tracker
            </Link>
            
            {/* Navigation menu for desktop */}
            {!isMobile && (
              <nav className="flex items-center space-x-6">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-sm text-muted-foreground hover:text-primary data-[state=open]:text-primary">
                        {t('landing.features')}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-4 w-[400px]">
                          <Link to="/journal" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                            <Package className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{t('nav.journal')}</div>
                              <p className="text-sm text-muted-foreground">
                                {t('fr') === 'fr' ? 
                                  "Suivez vos trades et analysez vos performances" : 
                                  "Track your trades and analyze your performance"}
                              </p>
                            </div>
                          </Link>
                          <Link to="/statistics" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                            <BarChart3 className="h-4 w-4" />
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{t('fr') === 'fr' ? "Analyses avancées" : "Advanced Analysis"}</div>
                                <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {t('fr') === 'fr' ? 
                                  "Statistiques détaillées de votre trading" : 
                                  "Detailed statistics of your trading"}
                              </p>
                            </div>
                          </Link>
                          <Link to="/calendar" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                            <Calendar className="h-4 w-4" />
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{t('fr') === 'fr' ? "Calendrier des trades" : "Trades Calendar"}</div>
                                <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {t('fr') === 'fr' ? 
                                  "Visualisez vos trades dans le temps" : 
                                  "Visualize your trades over time"}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                <Link to="/premium" className="text-sm text-muted-foreground hover:text-primary">
                  {t('landing.pricing')}
                </Link>

                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-sm text-muted-foreground hover:text-primary data-[state=open]:text-primary">
                        {t('landing.resources')}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-4 w-[400px]">
                          <Link to="/blog" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                            <FileText className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{t('landing.blog')}</div>
                              <p className="text-sm text-muted-foreground">
                                {t('fr') === 'fr' ? 
                                  "Articles et guides sur le trading" : 
                                  "Articles and guides on trading"}
                              </p>
                            </div>
                          </Link>
                          <Link to="/faq" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                            <HelpCircle className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{t('landing.faq')}</div>
                              <p className="text-sm text-muted-foreground">
                                {t('fr') === 'fr' ? 
                                  "Réponses aux questions fréquentes" : 
                                  "Answers to frequently asked questions"}
                              </p>
                            </div>
                          </Link>
                          <Link to="/demonstration" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                            <Video className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{t('landing.demo')}</div>
                              <p className="text-sm text-muted-foreground">
                                {t('fr') === 'fr' ? 
                                  "Guide d'utilisation de la plateforme" : 
                                  "Platform usage guide"}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-sm text-muted-foreground hover:text-primary data-[state=open]:text-primary">
                        {t('landing.about')}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-4 w-[400px]">
                          <Link to="/about" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                            <Users className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{t('landing.team')}</div>
                              <p className="text-sm text-muted-foreground">
                                {t('fr') === 'fr' ? 
                                  "Découvrez qui nous sommes" : 
                                  "Discover who we are"}
                              </p>
                            </div>
                          </Link>
                          <Link to="/contact" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md">
                            <Phone className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{t('landing.contact')}</div>
                              <p className="text-sm text-muted-foreground">
                                {t('fr') === 'fr' ? 
                                  "Une question ? Contactez-nous" : 
                                  "Have a question? Contact us"}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-1">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] sm:w-80 pt-16">
                  <div className="flex flex-col space-y-6">
                    <div className="space-y-4">
                      <div className="text-lg font-medium">{t('landing.features')}</div>
                      <div className="space-y-2">
                        <SheetClose asChild>
                          <Link to="/journal" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                            <Package className="h-4 w-4" />
                            {t('nav.journal')}
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/statistics" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                            <BarChart3 className="h-4 w-4" />
                            {t('nav.statistics')}
                            <Star className="h-3 w-3 text-yellow-500 ml-1" fill="currentColor" />
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/calendar" className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                            <Calendar className="h-4 w-4" />
                            {t('nav.calendar')}
                            <Star className="h-3 w-3 text-yellow-500 ml-1" fill="currentColor" />
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                    
                    <hr className="border-border" />
                    
                    <div className="space-y-2">
                      <SheetClose asChild>
                        <Link to="/premium" className="block p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                          {t('landing.pricing')}
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/blog" className="block p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                          {t('landing.blog')}
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/contact" className="block p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground">
                          {t('landing.contact')}
                        </Link>
                      </SheetClose>
                    </div>
                    
                    <hr className="border-border" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <SheetClose asChild>
                          <Link to="/login" className="w-full">
                            <Button variant="outline" className="w-full">{t('auth.login')}</Button>
                          </Link>
                        </SheetClose>
                      </div>
                      <SheetClose asChild>
                        <Link to="/dashboard" className="w-full">
                          <Button className="w-full">{t('auth.signup')}</Button>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            {/* Language switcher */}
            <LanguageSwitcher />

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="h-9 w-9"
              aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Hide login button on very small screens */}
            <Button asChild variant="ghost" size="sm" className="hidden xs:flex">
              <Link to="/login">{t('auth.login')}</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/dashboard">{t('auth.signup')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
