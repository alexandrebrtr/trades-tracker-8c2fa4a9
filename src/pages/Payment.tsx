
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Check, Star, Download, Gift, Zap, Copy, QrCode, Bitcoin, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePremium } from '@/context/PremiumContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Schéma de validation du formulaire d'adresses crypto
const cryptoAddressSchema = z.object({
  bitcoin: z.string().min(26, "L'adresse Bitcoin doit contenir au moins 26 caractères"),
  ethereum: z.string().min(42, "L'adresse Ethereum doit contenir au moins 42 caractères"),
  usdc: z.string().min(42, "L'adresse USDC (ERC-20) doit contenir au moins 42 caractères"),
});

export default function Payment() {
  const { isPremium, setPremiumStatus, premiumExpires } = usePremium();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  
  const [step, setStep] = useState<'plan' | 'payment' | 'confirmation' | 'setup'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [selectedCrypto, setSelectedCrypto] = useState<'bitcoin' | 'ethereum' | 'usdc'>('bitcoin');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Récupérez les adresses depuis le local storage ou utilisez des adresses par défaut
  const getStoredWallets = () => {
    const stored = localStorage.getItem('cryptoWallets');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Erreur lors de la lecture des adresses crypto:", e);
      }
    }
    return {
      bitcoin: '',
      ethereum: '',
      usdc: ''
    };
  };
  
  const [cryptoWallets, setCryptoWallets] = useState(getStoredWallets());
  
  // Formulaire pour configurer les adresses crypto
  const form = useForm<z.infer<typeof cryptoAddressSchema>>({
    resolver: zodResolver(cryptoAddressSchema),
    defaultValues: {
      bitcoin: cryptoWallets.bitcoin || '',
      ethereum: cryptoWallets.ethereum || '',
      usdc: cryptoWallets.usdc || '',
    },
  });
  
  const prices = {
    monthly: 9.99,
    annual: 99.99
  };

  const cryptoPrices = {
    bitcoin: { 
      monthly: 0.00024, 
      annual: 0.0024
    },
    ethereum: { 
      monthly: 0.0034, 
      annual: 0.034
    },
    usdc: { 
      monthly: 9.99, 
      annual: 99.99
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié dans le presse-papier",
      description: "L'adresse a été copiée dans le presse-papier."
    });
  };

  const saveWalletAddresses = (data: z.infer<typeof cryptoAddressSchema>) => {
    // Enregistrez les adresses dans le localStorage
    localStorage.setItem('cryptoWallets', JSON.stringify(data));
    setCryptoWallets(data);
    
    toast({
      title: "Adresses enregistrées",
      description: "Vos adresses de portefeuille ont été enregistrées avec succès."
    });
    
    if (step === 'setup') {
      setStep('plan');
    }
  };

  // Vérifier si les adresses sont configurées
  useEffect(() => {
    const wallets = getStoredWallets();
    if (!wallets.bitcoin && !wallets.ethereum && !wallets.usdc) {
      setStep('setup');
    }
  }, []);

  // Affichage du profil premium
  if (isPremium) {
    const expiryDate = premiumExpires ? new Date(premiumExpires) : null;
    const formattedExpiryDate = expiryDate ? expiryDate.toLocaleDateString('fr-FR') : 'Date inconnue';
    
    return (
      <AppLayout>
        <div className="container py-8 max-w-4xl mx-auto page-transition">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Votre Abonnement Premium</h1>
              <p className="text-muted-foreground mt-2">
                Merci pour votre confiance ! Vous bénéficiez actuellement de toutes les fonctionnalités premium.
              </p>
            </div>
            
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      Compte Premium Actif
                    </CardTitle>
                    <CardDescription>
                      Votre abonnement est valide jusqu'au {formattedExpiryDate}
                    </CardDescription>
                  </div>
                  <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    Actif
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background/80 p-4 rounded-lg flex flex-col items-center text-center">
                    <Zap className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Analyses Avancées</h3>
                    <p className="text-sm text-muted-foreground mt-1">Accès à toutes les analyses premium</p>
                  </div>
                  <div className="bg-background/80 p-4 rounded-lg flex flex-col items-center text-center">
                    <Download className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Exports Illimités</h3>
                    <p className="text-sm text-muted-foreground mt-1">Exportez vos données sans limitation</p>
                  </div>
                  <div className="bg-background/80 p-4 rounded-lg flex flex-col items-center text-center">
                    <Gift className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Fonctionnalités Exclusives</h3>
                    <p className="text-sm text-muted-foreground mt-1">Accès aux futures fonctionnalités</p>
                  </div>
                </div>
                
                <div className="bg-background/80 p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-medium mb-4">Gérer votre abonnement</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1" variant="outline" onClick={() => navigate('/statistics')}>
                      Accéder aux statistiques avancées
                    </Button>
                    <Button className="flex-1" onClick={() => navigate('/profile')}>
                      Voir mon profil
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-background/50 flex flex-col sm:flex-row items-center gap-4 justify-between rounded-b-lg">
                <p className="text-sm text-muted-foreground">
                  Pour toute question concernant votre abonnement, contactez notre support.
                </p>
                <Button variant="outline" size="sm">
                  Contacter le support
                </Button>
              </CardFooter>
            </Card>
            
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Avantages Premium dont vous bénéficiez</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Mesures de performance avancées</h3>
                      <p className="text-sm text-muted-foreground">Suivez vos performances avec des indicateurs professionnels</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Analyse de risque détaillée</h3>
                      <p className="text-sm text-muted-foreground">Obtenez des insights sur votre exposition au risque</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Recommandations personnalisées</h3>
                      <p className="text-sm text-muted-foreground">Recevez des conseils adaptés à votre profil</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Analyse détaillée des patterns</h3>
                      <p className="text-sm text-muted-foreground">Identifiez les patterns qui fonctionnent pour vous</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Comparaison avec les indices</h3>
                      <p className="text-sm text-muted-foreground">Comparez vos performances avec les principaux indices</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/20 p-2 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Support prioritaire</h3>
                      <p className="text-sm text-muted-foreground">Accédez à un support technique dédié</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const verifyCryptoTransaction = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      const isVerified = await verifyCryptoTransaction();
      if (!isVerified) {
        throw new Error("La transaction n'a pas pu être vérifiée");
      }
      
      await setPremiumStatus(true);
      await refreshProfile();
      
      console.log(`Premium plan purchased: ${selectedPlan}, price: ${cryptoPrices[selectedCrypto][selectedPlan]} ${selectedCrypto}, method: crypto`);
      
      setStep('confirmation');
      
      toast({
        title: "Toutes les fonctionnalités premium sont activées",
        description: "Vous avez maintenant accès à toutes les fonctionnalités premium!",
      });
    } catch (error) {
      console.error("Erreur lors du traitement du paiement:", error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Configuration des adresses de portefeuille crypto
  if (step === 'setup') {
    return (
      <AppLayout>
        <div className="container py-8 max-w-4xl mx-auto page-transition">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Configuration des portefeuilles</h1>
              <p className="text-muted-foreground mt-2">
                Configurez vos adresses de portefeuille crypto pour recevoir les paiements.
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Vos adresses de portefeuille</CardTitle>
                <CardDescription>
                  Entrez les adresses où vous souhaitez recevoir les paiements en crypto-monnaie.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(saveWalletAddresses)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="bitcoin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Bitcoin className="h-5 w-5 text-amber-500" />
                            Adresse Bitcoin
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Entrez votre adresse Bitcoin" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ethereum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                            </svg>
                            Adresse Ethereum
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Entrez votre adresse Ethereum" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="usdc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                              <span className="font-bold text-xs">USDC</span>
                            </div>
                            Adresse USDC (ERC-20)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Entrez votre adresse USDC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-2">
                      <Button type="submit" className="w-full">
                        Enregistrer mes adresses
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container py-8 max-w-4xl mx-auto page-transition">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paiement</h1>
            <p className="text-muted-foreground mt-2">
              Accédez à toutes les fonctionnalités premium de TraderSync
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step === 'plan' || step === 'payment' || step === 'confirmation' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className={step === 'plan' || step === 'payment' || step === 'confirmation' ? 'font-medium' : 'text-muted-foreground'}>Choisir un forfait</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div className="flex items-center gap-2">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step === 'payment' || step === 'confirmation' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <span className={step === 'payment' || step === 'confirmation' ? 'font-medium' : 'text-muted-foreground'}>Paiement</span>
            </div>
            <Separator className="flex-1 mx-4" />
            <div className="flex items-center gap-2">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step === 'confirmation' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <span className={step === 'confirmation' ? 'font-medium' : 'text-muted-foreground'}>Confirmation</span>
            </div>
          </div>

          {step === 'plan' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={`border-2 ${selectedPlan === 'monthly' ? 'border-primary' : 'border-border'}`}>
                <CardHeader>
                  <CardTitle>Abonnement Mensuel</CardTitle>
                  <CardDescription>Accès premium pendant 1 mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">9,99 € <span className="text-sm font-normal text-muted-foreground">/mois</span></div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Analyses avancées</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Assistant IA illimité</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Export de données</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <RadioGroup value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as 'monthly' | 'annual')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">Sélectionner</Label>
                    </div>
                  </RadioGroup>
                </CardFooter>
              </Card>

              <Card className={`border-2 ${selectedPlan === 'annual' ? 'border-primary' : 'border-border'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Abonnement Annuel</CardTitle>
                      <CardDescription>Accès premium pendant 12 mois</CardDescription>
                    </div>
                    <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">
                      -17% d'économie
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">99,99 € <span className="text-sm font-normal text-muted-foreground">/an</span></div>
                  <div className="text-sm text-muted-foreground">Soit 8,33 € par mois</div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Analyses avancées</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Assistant IA illimité</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Export de données</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Support prioritaire</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <RadioGroup value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as 'monthly' | 'annual')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="annual" id="annual" />
                      <Label htmlFor="annual">Sélectionner</Label>
                    </div>
                  </RadioGroup>
                </CardFooter>
              </Card>

              <div className="md:col-span-2">
                <Button onClick={() => setStep('payment')} className="w-full">
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Paiement en crypto-monnaie</CardTitle>
                      <CardDescription>
                        Sélectionnez une crypto-monnaie et effectuez le paiement
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Sélectionner une crypto-monnaie</Label>
                        <RadioGroup 
                          value={selectedCrypto} 
                          onValueChange={(value) => setSelectedCrypto(value as 'bitcoin' | 'ethereum' | 'usdc')}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div className={`flex flex-col items-center border rounded-lg p-3 ${selectedCrypto === 'bitcoin' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                            <RadioGroupItem value="bitcoin" id="bitcoin" className="sr-only" />
                            <Label htmlFor="bitcoin" className="cursor-pointer flex flex-col items-center">
                              <Bitcoin className="h-8 w-8 mb-2 text-amber-500" />
                              <span className="font-medium">Bitcoin</span>
                              <span className="text-xs text-muted-foreground mt-1">
                                {cryptoPrices.bitcoin[selectedPlan]} BTC
                              </span>
                            </Label>
                          </div>
                          
                          <div className={`flex flex-col items-center border rounded-lg p-3 ${selectedCrypto === 'ethereum' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                            <RadioGroupItem value="ethereum" id="ethereum" className="sr-only" />
                            <Label htmlFor="ethereum" className="cursor-pointer flex flex-col items-center">
                              <svg className="h-8 w-8 mb-2 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                              </svg>
                              <span className="font-medium">Ethereum</span>
                              <span className="text-xs text-muted-foreground mt-1">
                                {cryptoPrices.ethereum[selectedPlan]} ETH
                              </span>
                            </Label>
                          </div>
                          
                          <div className={`flex flex-col items-center border rounded-lg p-3 ${selectedCrypto === 'usdc' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                            <RadioGroupItem value="usdc" id="usdc" className="sr-only" />
                            <Label htmlFor="usdc" className="cursor-pointer flex flex-col items-center">
                              <div className="h-8 w-8 mb-2 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                <span className="font-bold text-xs">USDC</span>
                              </div>
                              <span className="font-medium">USD Coin</span>
                              <span className="text-xs text-muted-foreground mt-1">
                                {cryptoPrices.usdc[selectedPlan]} USDC
                              </span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">Adresse de paiement</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(cryptoWallets[selectedCrypto])}
                            className="flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copier
                          </Button>
                        </div>
                        <div className="flex flex-col items-center space-y-3">
                          <div className="bg-white p-2 rounded">
                            <QrCode className="h-32 w-32" />
                          </div>
                          <div className="bg-background text-xs sm:text-sm p-2 rounded break-all text-center border">
                            {cryptoWallets[selectedCrypto] || "Aucune adresse configurée"}
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                          <p className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                            Envoyez exactement <span className="font-medium mx-1">{cryptoPrices[selectedCrypto][selectedPlan]} {selectedCrypto.toUpperCase()}</span> à cette adresse.
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <h3 className="font-medium mb-2">Instructions</h3>
                        <ol className="text-sm space-y-2 list-decimal pl-4">
                          <li>Copier l'adresse ou scanner le QR code avec votre portefeuille crypto</li>
                          <li>Envoyer exactement le montant indiqué à cette adresse</li>
                          <li>Après confirmation de la transaction (peut prendre quelques minutes), cliquer sur "Vérifier le paiement"</li>
                          <li>Votre compte sera mis à niveau vers Premium automatiquement après vérification</li>
                        </ol>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => setStep('setup')}
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Configurer mes adresses
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Résumé de la commande</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Forfait</span>
                        <span>{selectedPlan === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Prix</span>
                        <span>
                          {`${cryptoPrices[selectedCrypto][selectedPlan]} ${selectedCrypto.toUpperCase()}`}
                        </span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>
                          {`${cryptoPrices[selectedCrypto][selectedPlan]} ${selectedCrypto.toUpperCase()}`}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        En procédant au paiement, vous acceptez nos conditions générales d'utilisation et notre politique de confidentialité.
                      </div>
                    </CardContent>
                    <CardFooter className="flex-col space-y-2">
                      <Button 
                        onClick={processPayment} 
                        className="w-full" 
                        disabled={isProcessing || !cryptoWallets[selectedCrypto]}
                      >
                        {isProcessing 
                          ? "Traitement en cours..." 
                          : "Vérifier le paiement"
                        }
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setStep('plan')} 
                        className="w-full"
                        disabled={isProcessing}
                      >
                        Retour
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="space-y-6">
              <Card className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Paiement réussi!</h2>
                  <p className="text-muted-foreground mb-6">
                    Votre compte a été mis à niveau avec succès vers le forfait premium.
                  </p>
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-primary" />
                      Compte Premium
                    </div>
                    <div className="bg-muted text-muted-foreground text-sm font-medium px-3 py-1 rounded-full">
                      Forfait {selectedPlan === 'monthly' ? 'Mensuel' : 'Annuel'}
                    </div>
                  </div>
                  <Button onClick={() => navigate('/profile')} className="w-full sm:w-auto">
                    Voir mon profil
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
