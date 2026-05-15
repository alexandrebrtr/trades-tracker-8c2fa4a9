
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStartDateForTimeframe, generateMockData, generatePerformanceData } from '@/utils/chartUtils';
import { useAccount } from '@/context/AccountContext';

export const useChartData = (userId?: string, timeframe: '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL' = '1M') => {
  const { activeAccountId, activeAccount } = useAccount();
  const [data, setData] = useState<any[]>([]);
  const [isPositive, setIsPositive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      if (!userId || !activeAccountId) {
        // Générer des données fictives si aucun utilisateur n'est connecté
        const mockData = generateMockData(timeframe);
        setData(mockData);
        setIsPositive(mockData && mockData.length > 0 ? mockData[mockData.length - 1].value >= mockData[0].value : true);
        setIsLoading(false);
        return;
      }

      try {
        const initialBalance = Number(activeAccount?.initial_capital ?? 0) || 0;

        // Déterminer la date de début en fonction de la période sélectionnée
        const startDate = getStartDateForTimeframe(timeframe);

        // Récupérer les trades du compte actif pour la période
        let query = supabase
          .from('trades')
          .select('*')
          .eq('user_id', userId)
          .eq('account_id', activeAccountId);
          
        // Ajouter le filtre de date sauf pour ALL
        if (timeframe !== 'ALL') {
          query = query.gte('date', startDate.toISOString());
        }
        
        const { data: trades, error } = await query.order('date', { ascending: true });

        if (error) throw error;

        // Générer une série temporelle avec le solde après chaque trade
        // Même s'il n'y a pas de trades, on affichera une ligne droite avec le solde actuel
        const performanceData = generatePerformanceData(trades || [], initialBalance, timeframe);
        
        setData(performanceData);
        setIsPositive(
          performanceData && performanceData.length > 1 
          ? performanceData[performanceData.length - 1].value >= performanceData[0].value 
          : true
        );
      } catch (error) {
        console.error('Erreur lors de la récupération des données de performance:', error);
        // En cas d'erreur, utiliser des données fictives
        const mockData = generateMockData(timeframe);
        setData(mockData);
        setIsPositive(mockData && mockData.length > 0 ? mockData[mockData.length - 1].value >= mockData[0].value : true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, timeframe, activeAccountId, activeAccount?.initial_capital]);

  return { data, isPositive, isLoading };
};
