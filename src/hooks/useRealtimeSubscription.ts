
import { useEffect, useState } from 'react';
import { RealtimeService } from '@/services/RealtimeService';

/**
 * Hook pour s'abonner aux changements en temps réel sur les profils
 * @returns Les données du dernier changement
 */
export function useRealtimeSubscription() {
  const [lastChange, setLastChange] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Initialiser l'abonnement
    const unsubscribe = RealtimeService.subscribeToProfiles((payload) => {
      setLastChange(payload);
    });
    
    setIsSubscribed(true);
    
    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      unsubscribe();
      setIsSubscribed(false);
    };
  }, []);

  return { lastChange, isSubscribed };
}
