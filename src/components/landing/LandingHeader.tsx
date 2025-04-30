
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 w-full flex items-center justify-between h-16">
        <Link
          to="/"
          className="text-xl font-bold flex items-center gap-2 text-primary"
        >
          <img
            src="/lovable-uploads/bb895995-774e-458a-9166-661f9804f512.png"
            alt="TradesTracker Logo"
            className="w-8 h-8"
          />
          TradesTracker
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/blog"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t("nav.blog")}
          </Link>
          <Link
            to="/team"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t("nav.team")}
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t("nav.contact")}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              changeLanguage(language === "en" ? "fr" : "en")
            }
            className="px-2"
          >
            {language === "en" ? "FR" : "EN"}
          </Button>
          {user ? (
            <Button asChild>
              <Link to="/dashboard">{t("landing.dashboard")}</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">{t("auth.login")}</Link>
            </Button>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 -mr-2 focus:outline-none"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(menuOpen && "hidden")}
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(!menuOpen && "hidden")}
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden absolute top-16 inset-x-0 bg-white dark:bg-zinc-900 border-b transition-all duration-300 overflow-hidden",
          menuOpen ? "max-h-64" : "max-h-0"
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
          <Link
            to="/blog"
            className="text-sm font-medium py-2 transition-colors hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.blog")}
          </Link>
          <Link
            to="/team"
            className="text-sm font-medium py-2 transition-colors hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.team")}
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium py-2 transition-colors hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            {t("nav.contact")}
          </Link>
          <div className="flex items-center justify-between py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                changeLanguage(language === "en" ? "fr" : "en");
                setMenuOpen(false);
              }}
            >
              {language === "en" ? "Français" : "English"}
            </Button>
            {user ? (
              <Button asChild onClick={() => setMenuOpen(false)}>
                <Link to="/dashboard">{t("landing.dashboard")}</Link>
              </Button>
            ) : (
              <Button asChild onClick={() => setMenuOpen(false)}>
                <Link to="/login">{t("auth.login")}</Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
