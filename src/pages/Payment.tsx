
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { Check, CreditCard, Star } from 'lucide-react';

export default function Payment() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setPremiumStatus } = usePremium();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!cardNumber || !cardName || !expiryDate || !cvc) {
      toast({
        title: "Erreur de paiement",
        description: "Veuillez remplir tous les champs de paiement.",
        variant: "destructive",
      });
      return;
    }
    
    // Simuler le paiement réussi
    toast({
      title: "Paiement réussi",
      description: "Votre abonnement Premium est maintenant actif.",
    });
    
    // Activer le status premium
    setPremiumStatus(true);
    
    // Rediriger vers le dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="page-transition space-y-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-12 w-12 text-yellow-500 fill-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Finaliser votre abonnement</h1>
          <p className="text-muted-foreground mt-2">
            Vous êtes à un pas de débloquer toutes les fonctionnalités Premium
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de paiement</CardTitle>
              <CardDescription>
                Vos informations de paiement sont sécurisées et cryptées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nom sur la carte</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Doe" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <div className="relative">
                      <Input 
                        id="cardNumber" 
                        placeholder="1234 5678 9012 3456" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        maxLength={16}
                      />
                      <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Date d'expiration</Label>
                      <Input 
                        id="expiryDate" 
                        placeholder="MM/YY" 
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input 
                        id="cvc" 
                        placeholder="123" 
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Payer maintenant
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Abonnement Premium Mensuel</span>
                <span>9,99€</span>
              </div>
              <div className="flex justify-between">
                <span>TVA (20%)</span>
                <span>2,00€</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>11,99€</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Facturé mensuellement
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="w-full space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Accès à la communauté de traders</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Statistiques avancées</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm">Automatisation en temps réel</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
