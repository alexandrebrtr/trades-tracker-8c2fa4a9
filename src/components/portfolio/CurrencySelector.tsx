
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCurrency, Currency } from "@/context/CurrencyContext";
import { Coins } from "lucide-react";

export function CurrencySelector() {
  const { currency, changeCurrency } = useCurrency();
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currency);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleCurrencyChange = async () => {
    if (selectedCurrency === currency) return;
    
    setIsUpdating(true);
    try {
      await changeCurrency(selectedCurrency);
      toast({
        title: "Devise mise à jour",
        description: `La devise par défaut a été changée en ${selectedCurrency}`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors du changement de devise",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const currencies = [
    { value: "EUR", label: "Euro (€)", description: "Euro - Union Européenne" },
    { value: "USD", label: "Dollar américain ($)", description: "United States Dollar" },
    { value: "GBP", label: "Livre sterling (£)", description: "British Pound Sterling" },
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Devise par défaut
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Sélectionnez votre devise préférée</Label>
            <RadioGroup 
              value={selectedCurrency} 
              onValueChange={(value) => setSelectedCurrency(value as Currency)}
              className="space-y-2"
            >
              {currencies.map((curr) => (
                <div 
                  key={curr.value}
                  className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${selectedCurrency === curr.value ? "border-primary bg-primary/5" : "border-muted-foreground/20"}`}
                >
                  <RadioGroupItem value={curr.value} id={curr.value} />
                  <Label htmlFor={curr.value} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{curr.label}</span>
                    <span className="text-sm text-muted-foreground">{curr.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <Button 
            onClick={handleCurrencyChange}
            disabled={selectedCurrency === currency || isUpdating}
            className="ml-auto"
          >
            {isUpdating ? "Mise à jour..." : "Enregistrer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
