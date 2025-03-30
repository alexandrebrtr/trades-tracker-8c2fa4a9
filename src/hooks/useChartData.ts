
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStartDateForTimeframe, generateMockData, generatePerformanceData } from '@/utils/chartUtils';

export const useChartData = (userId?: string, timeframe: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL' = '1M') => {
  const [data, setData] = useState<any[]>([]);
  const [isPositive, setIsPositive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      if (!userId) {
        // Générer des données fictives si aucun utilisateur n'est connecté
        const mockData = generateMockData(timeframe);
        setData(mockData);
        setIsPositive(mockData[mockData.length - 1].value >= mockData[0].value);
        setIsLoading(false);
        return;
      }

      try {
        // Récupérer le solde du portfolio d'abord
        const { data: portfolios, error: portfolioError } = await supabase
          .from('portfolios')
          .select('balance')
          .eq('user_id', userId)
          .limit(1);

        if (portfolioError) throw portfolioError;

        const initialBalance = portfolios && portfolios.length > 0 ? portfolios[0].balance : 10000;
        
        // Déterminer la date de début en fonction de la période sélectionnée
        const startDate = getStartDateForTimeframe(timeframe);
        
        // Récupérer les trades de l'utilisateur pour la période
        const { data: trades, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', userId)
          .gte('date', startDate.toISOString())
          .order('date', { ascending: true });

        if (error) throw error;

        // Générer une série temporelle avec le solde après chaque trade
        // Même s'il n'y a pas de trades, on affichera une ligne droite avec le solde actuel
        const performanceData = generatePerformanceData(trades || [], initialBalance, timeframe);
        
        setData(performanceData);
        setIsPositive(
          performanceData.length > 1 
          ? performanceData[performanceData.length - 1].value >= performanceData[0].value 
          : true
        );
      } catch (error) {
        console.error('Erreur lors de la récupération des données de performance:', error);
        // En cas d'erreur, utiliser des données fictives
        const mockData = generateMockData(timeframe);
        setData(mockData);
        setIsPositive(mockData[mockData.length - 1].value >= mockData[0].value);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, timeframe]);

  return { data, isPositive, isLoading };
};
