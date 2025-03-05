
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { Check, CreditCard, Star, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function Payment() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [planType, setPlanType] = useState<'monthly' | 'yearly'>('monthly');
  const [planPrice, setPlanPrice] = useState(11.99);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setPremiumStatus } = usePremium();
  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    // Set plan price based on selection
    if (planType === 'monthly') {
      setPlanPrice(11.99);
    } else {
      setPlanPrice(95.88);
    }
  }, [planType]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (paymentMethod === 'card' && (!cardNumber || !cardName || !expiryDate || !cvc)) {
      toast({
        title: "Erreur de paiement",
        description: "Veuillez remplir tous les champs de paiement.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulating payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile with premium status
      if (user) {
        // Update the profile to record the subscription date
        const now = new Date();
        const expiryDate = new Date();
        
        if (planType === 'monthly') {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }
        
        const { error } = await supabase
          .from('profiles')
          .update({
            premium: true,
            premium_since: now.toISOString(),
            premium_expires: expiryDate.toISOString(),
            updated_at: now.toISOString()
          })
          .eq('id', user.id);
          
        if (error) {
          throw error;
        }
        
        // Refresh the profile
        await refreshProfile();
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
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppLayout>
      <div className="page-transition space-y-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/premium')} 
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <div className="flex items-center text-sm text-muted-foreground gap-1">
            <ShieldCheck className="h-4 w-4" />
            Paiement sécurisé
          </div>
        </div>
        
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Votre plan</CardTitle>
                <CardDescription>
                  Choisissez la durée de votre abonnement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${planType === 'monthly' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                    onClick={() => setPlanType('monthly')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Abonnement mensuel</h3>
                        <p className="text-sm text-muted-foreground">Facturé mensuellement</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">9,99€ / mois</div>
                        <div className="text-xs text-muted-foreground">+TVA</div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${planType === 'yearly' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                    onClick={() => setPlanType('yearly')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Abonnement annuel</h3>
                          <span className="bg-green-500/10 text-green-600 text-xs font-medium px-2 py-0.5 rounded">-20%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Facturé annuellement</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">95,88€ / an</div>
                        <div className="text-xs text-muted-foreground">+TVA</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Méthode de paiement</CardTitle>
                <CardDescription>
                  Vos informations de paiement sont sécurisées et cryptées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">Carte bancaire</h3>
                        <p className="text-sm text-muted-foreground">Visa, MasterCard, etc.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                    onClick={() => setPaymentMethod('bank')}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">Virement bancaire</h3>
                        <p className="text-sm text-muted-foreground">Prélèvement SEPA</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handlePayment} className="space-y-6">
                  {paymentMethod === 'card' && (
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
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
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
                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                            maxLength={5}
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
                  )}
                  
                  {paymentMethod === 'bank' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Nom du titulaire</Label>
                        <Input 
                          id="accountName" 
                          placeholder="John Doe" 
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="iban">IBAN</Label>
                        <Input 
                          id="iban" 
                          placeholder="FR76 1234 5678 9012 3456 7890 123" 
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Traitement en cours...' : `Payer ${planPrice.toFixed(2)}€`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{planType === 'monthly' ? 'Abonnement Premium Mensuel' : 'Abonnement Premium Annuel'}</span>
                <span>{planType === 'monthly' ? '9,99€' : '95,88€'}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA (20%)</span>
                <span>{planType === 'monthly' ? '2,00€' : '19,12€'}</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{planPrice.toFixed(2)}€</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {planType === 'monthly' ? 'Facturé mensuellement' : 'Facturé annuellement'}
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
                {planType === 'yearly' && (
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Webinaires exclusifs</span>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
