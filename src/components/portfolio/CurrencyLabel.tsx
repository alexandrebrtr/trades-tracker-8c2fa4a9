
import { Button } from "@/components/ui/button";
import { useCurrencySettings, CurrencyCode } from "@/hooks/useCurrencySettings";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

export function CurrencyLabel() {
  const { currency } = useCurrencySettings();
  
  // Map des codes de devise vers les noms complets
  const currencyNames: Record<CurrencyCode, string> = {
    EUR: "Euro",
    USD: "Dollar américain",
    GBP: "Livre sterling",
    JPY: "Yen japonais",
    CHF: "Franc suisse",
    CAD: "Dollar canadien",
    AUD: "Dollar australien"
  };
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-secondary/20 rounded-lg">
      <div>
        <p className="text-sm text-muted-foreground">Devise du compte</p>
        <p className="font-medium">
          {currencyNames[currency.code]} ({currency.symbol})
        </p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link to="/settings?tab=preferences">
          <Settings className="h-4 w-4 mr-2" />
          Modifier
        </Link>
      </Button>
    </div>
  );
}
