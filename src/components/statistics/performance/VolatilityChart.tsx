
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { parseISO, isValid, differenceInDays, format } from "date-fns";

interface VolatilityChartProps {
  data?: any[];
}

export const VolatilityChart = ({ data: propData }: VolatilityChartProps) => {
  const [loading, setLoading] = useState(true);
  const [volatilityData, setVolatilityData] = useState<any[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (propData && propData.length > 0) {
      setVolatilityData(propData);
      setLoading(false);
      return;
    }
    
    const calculateVolatility = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data: trades, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });
          
        if (error) throw error;
        
        if (!trades || trades.length === 0) {
          setVolatilityData([]);
          setLoading(false);
          return;
        }
        
        const volatility = calculateVolatilityFromTrades(trades);
        setVolatilityData(volatility);
      } catch (err) {
        console.error("Erreur lors du calcul de la volatilité:", err);
        setVolatilityData([]);
      } finally {
        setLoading(false);
      }
    };
    
    calculateVolatility();
  }, [user, propData]);
  
  const calculateVolatilityFromTrades = (trades: any[]) => {
    // Filtrer les trades avec des dates valides
    const validTrades = trades.filter(trade => {
      const date = parseISO(trade.date);
      return isValid(date);
    });
    
    if (validTrades.length < 5) {
      // Pas assez de données pour calculer la volatilité
      return [];
    }
    
    // Regrouper les trades par mois
    const tradesByMonth: Record<string, any[]> = {};
    validTrades.forEach(trade => {
      const date = parseISO(trade.date);
      const monthKey = format(date, 'MMM yyyy');
      
      if (!tradesByMonth[monthKey]) {
        tradesByMonth[monthKey] = [];
      }
      
      tradesByMonth[monthKey].push(trade);
    });
    
    // Calculer les rendements mensuels
    const monthlyReturns: Record<string, number> = {};
    Object.entries(tradesByMonth).forEach(([month, monthTrades]) => {
      // Somme des PnL du mois
      const monthlyPnL = monthTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
      
      // Estimer le capital investi pour le mois (simplification)
      const investedCapital = monthTrades.reduce((sum, trade) => sum + Math.abs(trade.entry_price * (trade.quantity || 1)), 0);
      
      // Calculer le rendement mensuel (en %)
      if (investedCapital > 0) {
        monthlyReturns[month] = (monthlyPnL / investedCapital) * 100;
      } else {
        monthlyReturns[month] = 0;
      }
    });
    
    // Calculer la volatilité glissante sur 3 mois
    const volatilityData: any[] = [];
    const months = Object.keys(monthlyReturns).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
    
    for (let i = 2; i < months.length; i++) {
      const window = [months[i-2], months[i-1], months[i]];
      const returns = window.map(month => monthlyReturns[month]);
      
      // Calculer la volatilité (écart-type des rendements)
      const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
      const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
      const volatility = Math.sqrt(variance);
      
      volatilityData.push({
        time: months[i],
        volatility: parseFloat(volatility.toFixed(2))
      });
    }
    
    return volatilityData;
  };
  
  // Add a more descriptive tooltip formatter
  const tooltipFormatter = (value: any) => {
    return [`${value}%`, 'Volatilité'];
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse de Volatilité</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse de Volatilité</CardTitle>
      </CardHeader>
      <CardContent>
        {volatilityData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
            <p>Pas assez de données pour calculer la volatilité.</p>
            <p className="text-sm mt-2">Ajoutez plus de trades pour voir cette analyse.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={volatilityData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 'dataMax + 5']} />
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="volatility" 
                name="Volatilité" 
                stroke="#f43f5e" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Ce graphique montre la volatilité de votre portefeuille sur différentes périodes. 
          Une volatilité plus basse indique généralement un risque réduit.</p>
        </div>
      </CardContent>
    </Card>
  );
};
