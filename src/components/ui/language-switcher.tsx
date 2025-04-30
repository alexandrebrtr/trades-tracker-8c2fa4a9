
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function LanguageSwitcher({ 
  variant = "ghost", 
  size = "icon" 
}: LanguageSwitcherProps) {
  const { language, changeLanguage } = useLanguage();
  
  const languages: { code: Language; label: string }[] = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
  ];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className="uppercase font-medium"
          aria-label="Changer de langue"
        >
          {language.substring(0, 2)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${language === lang.code ? 'font-medium text-primary' : ''}`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
