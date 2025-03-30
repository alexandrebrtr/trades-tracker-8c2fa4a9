
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { parseISO, isValid, format } from "date-fns";

interface CumulativeReturnsChartProps {
  data?: any[];
}

export const CumulativeReturnsChart = ({ data: propData }: CumulativeReturnsChartProps) => {
  const [loading, setLoading] = useState(true);
  const [returnsData, setReturnsData] = useState<any[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (propData && propData.length > 0) {
      setReturnsData(propData);
      setLoading(false);
      return;
    }
    
    const fetchReturnsData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Récupérer la balance de l'utilisateur depuis la table profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        
        const initialBalance = profileData?.balance || 10000;
        
        // Récupérer les trades
        const { data: trades, error: tradesError } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });
          
        if (tradesError) throw tradesError;
        
        if (!trades || trades.length === 0) {
          setReturnsData([]);
          setLoading(false);
          return;
        }
        
        const cumulativeData = calculateCumulativeReturns(trades, initialBalance);
        setReturnsData(cumulativeData);
      } catch (err) {
        console.error("Erreur lors du chargement des données de rendement:", err);
        setReturnsData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReturnsData();
  }, [user, propData]);
  
  const calculateCumulativeReturns = (trades: any[], initialBalance: number) => {
    let cumulativeBalance = initialBalance;
    const returnsData: any[] = [];
    
    // Ajouter le point de départ avec la balance initiale
    const firstTrade = trades[0];
    if (firstTrade) {
      const firstDate = parseISO(firstTrade.date);
      if (isValid(firstDate)) {
        returnsData.push({
          date: format(firstDate, 'dd/MM/yyyy'),
          return: cumulativeBalance
        });
      }
    } else {
      // Si pas de trades, retourner un tableau vide
      return [];
    }
    
    // Calculer l'évolution de la balance
    trades.forEach(trade => {
      const date = parseISO(trade.date);
      if (!isValid(date)) return;
      
      // Ajouter le PnL à la balance cumulative
      cumulativeBalance += trade.pnl || 0;
      
      returnsData.push({
        date: format(date, 'dd/MM/yyyy'),
        return: cumulativeBalance
      });
    });
    
    return returnsData;
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rendements Cumulés</CardTitle>
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
        <CardTitle>Rendements Cumulés</CardTitle>
      </CardHeader>
      <CardContent>
        {returnsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
            <p>Pas encore de données de rendement.</p>
            <p className="text-sm mt-2">Ajoutez des trades pour voir votre performance cumulée.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={returnsData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)
                }
              />
              <Tooltip 
                formatter={(value) => [
                  new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(Number(value)), 
                  'Rendement'
                ]} 
              />
              <Area 
                type="monotone" 
                dataKey="return" 
                stroke="#4ade80" 
                fillOpacity={1}
                fill="url(#colorReturn)" 
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
