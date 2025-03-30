import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { parseISO, differenceInDays, format } from "date-fns";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { UserSettings } from "@/context/PremiumContext";

export function PerformanceComparison() {
  const [loading, setLoading] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [initialValue, setInitialValue] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Récupérer les données du profil pour obtenir la balance initiale
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('balance, settings')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Récupérer l'historique des trades pour calculer la date de début
        const { data: trades, error: tradesError } = await supabase
          .from('trades')
          .select('date, pnl')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (tradesError) throw tradesError;

        // Valeur initiale et actuelle de la balance
        const currentBalance = profileData?.balance || 10000;
        
        // Extraire la balance initiale depuis settings ou utiliser 10000 par défaut
        const userSettings = profileData?.settings as UserSettings || {};
        const initialBalance = userSettings.initialBalance ? Number(userSettings.initialBalance) : 10000;
        
        if (!trades || trades.length === 0) {
          // Si pas de trades, utiliser des valeurs par défaut
          setInitialValue(initialBalance);
          setPortfolioValue(currentBalance);
          setStartDate(new Date(new Date().getFullYear() - 1, 0, 1)); // 1 an avant
        } else {
          // Trouver la première date de trade valide
          const validDates = trades
            .map(trade => parseISO(trade.date))
            .filter(date => !isNaN(date.getTime()));
          
          const firstTradeDate = validDates.length > 0 ? validDates[0] : new Date(new Date().getFullYear() - 1, 0, 1);
          setStartDate(firstTradeDate);
          
          // Utiliser la balance initiale définie par l'utilisateur
          setInitialValue(initialBalance);
          setPortfolioValue(currentBalance);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données de performance:", err);
        setInitialValue(10000);
        setPortfolioValue(10000);
        setStartDate(new Date(new Date().getFullYear() - 1, 0, 1));
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user]);

  // Calcul du rendement du portefeuille
  const portfolioReturn = initialValue > 0 ? ((portfolioValue - initialValue) / initialValue) * 100 : 0;
  
  // Calcul de la valeur théorique avec rendement de 10% annuel (S&P 500)
  const calculateSP500Value = () => {
    if (!startDate || initialValue <= 0) return initialValue;
    
    const today = new Date();
    const daysDiff = differenceInDays(today, startDate);
    if (daysDiff <= 0) return initialValue;
    
    // 10% par an converti en taux journalier
    const dailyRate = Math.pow(1.10, 1/365) - 1;
    const sp500Value = initialValue * Math.pow(1 + dailyRate, daysDiff);
    
    return sp500Value;
  };
  
  const sp500Value = calculateSP500Value();
  const sp500Return = initialValue > 0 ? ((sp500Value - initialValue) / initialValue) * 100 : 0;
  
  // Déterminer quelle performance est meilleure
  const portfolioOutperforms = portfolioReturn > sp500Return;
  const performanceDiff = Math.abs(portfolioReturn - sp500Return);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comparaison avec le Marché (S&P 500)</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison avec le Marché (S&P 500)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-primary/20 overflow-hidden">
            <CardHeader className="bg-primary/5 pb-2">
              <CardTitle className="text-xl">Votre Portefeuille</CardTitle>
              <p className="text-sm text-muted-foreground">
                Depuis {startDate ? format(startDate, 'dd/MM/yyyy') : 'le début'}
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Capital initial</p>
                  <p className="text-xl font-semibold">{formatCurrency(initialValue)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valeur actuelle</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(portfolioValue)}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Performance totale:</p>
                  <p className={`text-lg font-bold flex items-center ${portfolioReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {portfolioReturn >= 0 ? 
                      <ArrowUp className="h-4 w-4 mr-1" /> : 
                      <ArrowDown className="h-4 w-4 mr-1" />
                    }
                    {Math.abs(portfolioReturn).toFixed(2)}%
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Gains totaux</p>
                  <p className={`text-lg font-semibold ${portfolioValue >= initialValue ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(portfolioValue - initialValue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-muted overflow-hidden">
            <CardHeader className="bg-muted/20 pb-2">
              <CardTitle className="text-xl">S&P 500 (10% annuel)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Même période, même capital initial
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Capital initial</p>
                  <p className="text-xl font-semibold">{formatCurrency(initialValue)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valeur théorique actuelle</p>
                  <p className="text-2xl font-bold">{formatCurrency(sp500Value)}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Performance totale:</p>
                  <p className="text-lg font-bold flex items-center text-green-500">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {sp500Return.toFixed(2)}%
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Gains totaux</p>
                  <p className="text-lg font-semibold text-green-500">
                    {formatCurrency(sp500Value - initialValue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
          <p className="font-medium flex items-center gap-2">
            {portfolioOutperforms ? (
              <>
                <ArrowUp className="h-5 w-5 text-green-500" />
                <span>Votre portefeuille surperforme le S&P 500 de <span className="text-green-500 font-bold">{performanceDiff.toFixed(2)}%</span></span>
              </>
            ) : (
              <>
                <ArrowDown className="h-5 w-5 text-red-500" />
                <span>Votre portefeuille sous-performe le S&P 500 de <span className="text-red-500 font-bold">{performanceDiff.toFixed(2)}%</span></span>
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
