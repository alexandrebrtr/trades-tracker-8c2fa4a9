
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePremium } from '@/context/PremiumContext';
import { useBinanceSync } from '@/hooks/useBinanceSync';
import { Link } from 'react-router-dom';

export const BrokerSyncNotification = () => {
  const { user } = useAuth();
  const { isPremium, userSettings } = usePremium();
  const { synchronizeTrades, isLoading } = useBinanceSync();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Afficher la notification uniquement si l'utilisateur est premium et a un compte broker connecté
    if (isPremium && userSettings?.broker?.isConnected) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [isPremium, userSettings]);

  const handleSync = async () => {
    if (user && userSettings?.broker?.apiKey && userSettings?.broker?.secretKey) {
      await synchronizeTrades(
        user.id,
        userSettings.broker.apiKey,
        userSettings.broker.secretKey
      );
    }
  };

  if (!showNotification) return null;

  return (
    <div className="bg-muted/50 border rounded-lg p-4 mb-6 flex items-center justify-between">
      <div>
        <h3 className="font-medium">Compte {userSettings?.broker?.name} connecté</h3>
        <p className="text-sm text-muted-foreground">
          Synchronisez vos trades depuis {userSettings?.broker?.name} pour mettre à jour votre journal automatiquement.
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Synchronisation...' : 'Synchroniser'}
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link to="/trade">Gérer</Link>
        </Button>
      </div>
    </div>
  );
};
