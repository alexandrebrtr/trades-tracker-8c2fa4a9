
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("nav.home"), link: "/" },
    { label: t("nav.features"), link: "/#features" },
    { label: t("landing.howItWorks"), link: "/#how-it-works" },
    { label: t("landing.pricing"), link: "/premium" },
    { label: t("landing.testimonials"), link: "/#testimonials" },
    { label: t("landing.faq"), link: "/faq" },
  ];
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0b0f23]/80 backdrop-blur-md shadow-md" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold text-white">Trades Tracker</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to={item.link} 
                  className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          
          {/* Right Side - Login & Get Started */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              className="text-white hover:text-white hover:bg-white/10"
            >
              {t("auth.login")}
            </Button>
            
            <Button 
              variant="default" 
              onClick={() => navigate("/dashboard")}
              className="bg-white text-[#0b0f23] hover:bg-white/90"
            >
              {t("landing.getStarted")}
            </Button>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#0b0f23]/95 backdrop-blur-md border-[#6a39ff]/20 text-white">
                  <div className="flex flex-col space-y-6 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Menu</span>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                    </div>
                    <nav className="flex flex-col space-y-4">
                      {navItems.map((item, index) => (
                        <Link 
                          key={index}
                          to={item.link}
                          className="px-2 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                    <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/login")}
                        className="w-full border-white/20 text-white hover:bg-white/10"
                      >
                        {t("auth.login")}
                      </Button>
                      <Button 
                        variant="default" 
                        onClick={() => navigate("/dashboard")}
                        className="w-full bg-white text-[#0b0f23]"
                      >
                        {t("landing.getStarted")}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
