
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from 'lucide-react';
import { useCurrencySettings, CURRENCY_OPTIONS, CurrencyCode } from "@/hooks/useCurrencySettings";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrencySettings();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(currency.code);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleCurrencyChange = async () => {
    if (selectedCurrency === currency.code) return;
    
    setIsUpdating(true);
    try {
      await setCurrency(selectedCurrency);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Devise du compte</CardTitle>
        <CardDescription>
          Sélectionnez la devise principale de votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSuccess && (
          <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
            <Check className="h-4 w-4" />
            <AlertDescription>
              Devise mise à jour avec succès
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Select value={selectedCurrency} onValueChange={(value: CurrencyCode) => setSelectedCurrency(value)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleCurrencyChange} 
            disabled={isUpdating || selectedCurrency === currency.code}
            className="w-full sm:w-auto"
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {selectedCurrency === currency.code ? 'Devise actuelle' : 'Appliquer la devise'}
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          La devise choisie sera utilisée pour afficher tous les montants sur l'ensemble de l'application.
        </p>
      </CardContent>
    </Card>
  );
}
