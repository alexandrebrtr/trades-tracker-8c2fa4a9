
import { AppLayout } from '@/components/layout/AppLayout';
import { TradeForm } from '@/components/forms/TradeForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { usePremium } from '@/context/PremiumContext';

const TradeEntry = () => {
  const { toast } = useToast();
  const { isPremium } = usePremium();

  const handleConnectAccount = () => {
    if (!isPremium) {
      toast({
        title: "Fonctionnalité Premium",
        description: "Passez à l'abonnement Premium pour accéder à l'automatisation en temps réel.",
        variant: "default",
      });
    } else {
      // Si l'utilisateur est premium, on peut implémenter la logique de connexion ici
      toast({
        title: "Connecté",
        description: "Votre compte a été connecté avec succès.",
      });
    }
  };

  return (
    <AppLayout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Nouveau Trade</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleConnectAccount}
          >
            <Zap className="h-4 w-4" />
            <span>Connecter un compte</span>
          </Button>
        </div>
        <TradeForm />
      </div>
    </AppLayout>
  );
}

export default TradeEntry;
