
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TradeForm } from '@/components/forms/TradeForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Zap, Book, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { usePremium } from '@/context/PremiumContext';
import { useAuth } from '@/context/AuthContext';
import { BinanceService } from '@/services/BinanceService';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TradeEntry = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isPremium, userSettings, updateUserSettings } = usePremium();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [brokerName, setBrokerName] = useState(userSettings.broker?.name || '');
  const [apiKey, setApiKey] = useState(userSettings.broker?.apiKey || '');
  const [secretKey, setSecretKey] = useState(userSettings.broker?.secretKey || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);

  const handleConnectAccount = () => {
    if (!isPremium) {
      toast({
        title: "Fonctionnalité Premium",
        description: "Passez à l'abonnement Premium pour accéder à l'automatisation en temps réel.",
        variant: "default",
      });
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleSubmitConnection = async () => {
    setIsConnecting(true);
    setImportMessage('');
    setImportSuccess(null);
    
    try {
      // Mettre à jour les paramètres utilisateur
      const newSettings = {
        ...userSettings,
        broker: {
          name: brokerName,
          apiKey: apiKey,
          secretKey: secretKey,
          isConnected: true
        }
      };
      
      await updateUserSettings(newSettings);
      
      toast({
        title: "Connecté",
        description: `Votre compte ${brokerName} a été connecté avec succès.`,
      });
      
      // Attempt to import trades automatically
      if (user) {
        setIsImporting(true);
        setImportMessage('Importation des trades en cours...');
        
        const result = await BinanceService.importTradesFromBinance(user.id, {
          apiKey,
          secretKey
        });
        
        setImportSuccess(result.success);
        setImportMessage(result.message);
        
        if (result.success && result.count && result.count > 0) {
          toast({
            title: "Trades importés",
            description: `${result.count} trades ont été importés avec succès.`,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la connexion au broker:", error);
      setImportSuccess(false);
      setImportMessage("Impossible de connecter votre compte de trading. Veuillez vérifier vos informations.");
      
      toast({
        title: "Erreur de connexion",
        description: "Impossible de connecter votre compte de trading. Veuillez vérifier vos informations.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
      setIsImporting(false);
    }
  };

  // Handle manually trigger import
  const handleImportTrades = async () => {
    if (!user || !isPremium || !userSettings.broker?.isConnected) {
      toast({
        title: "Non connecté",
        description: "Veuillez d'abord connecter votre compte de trading.",
        variant: "destructive"
      });
      return;
    }
    
    setIsImporting(true);
    setImportMessage('Importation des trades en cours...');
    setImportSuccess(null);
    
    try {
      const result = await BinanceService.importTradesFromBinance(user.id, {
        apiKey: userSettings.broker.apiKey || '',
        secretKey: userSettings.broker.secretKey || ''
      });
      
      setImportSuccess(result.success);
      setImportMessage(result.message);
      
      if (result.success) {
        toast({
          title: "Trades importés",
          description: result.message,
        });
      } else {
        toast({
          title: "Erreur d'importation",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'importation des trades:", error);
      setImportSuccess(false);
      setImportMessage("Une erreur est survenue lors de l'importation des trades.");
      
      toast({
        title: "Erreur d'importation",
        description: "Une erreur est survenue lors de l'importation des trades.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AppLayout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Nouveau Trade</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/journal" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Voir le Journal</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleConnectAccount}
            >
              <Zap className="h-4 w-4" />
              <span>Connecter un compte</span>
            </Button>
            
            {isPremium && userSettings.broker?.isConnected && (
              <Button 
                variant="default" 
                className="flex items-center gap-2"
                onClick={handleImportTrades}
                disabled={isImporting}
              >
                <Zap className="h-4 w-4" />
                <span>{isImporting ? "Importation..." : "Importer les trades"}</span>
              </Button>
            )}
          </div>
        </div>
        
        {isPremium && userSettings.broker?.isConnected && (
          <Alert className="mb-6">
            <Zap className="h-4 w-4" />
            <AlertTitle>Compte connecté</AlertTitle>
            <AlertDescription>
              Votre compte {userSettings.broker.name} est connecté. Vous pouvez importer vos trades automatiquement.
            </AlertDescription>
          </Alert>
        )}
        
        <TradeForm />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connecter un compte de trading</DialogTitle>
              <DialogDescription>
                Entrez les informations d'API de votre broker pour synchroniser automatiquement vos trades.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="broker" className="text-right">
                  Broker
                </Label>
                <Select value={brokerName} onValueChange={setBrokerName}>
                  <SelectTrigger id="broker" className="col-span-3">
                    <SelectValue placeholder="Sélectionner un broker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="binance">Binance</SelectItem>
                    <SelectItem value="ftx">FTX</SelectItem>
                    <SelectItem value="coinbase">Coinbase</SelectItem>
                    <SelectItem value="kraken">Kraken</SelectItem>
                    <SelectItem value="mt4">MetaTrader 4</SelectItem>
                    <SelectItem value="mt5">MetaTrader 5</SelectItem>
                    <SelectItem value="trading212">Trading 212</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apiKey" className="text-right">
                  Clé API
                </Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="secretKey" className="text-right">
                  Clé Secrète
                </Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              {importMessage && (
                <Alert className={`col-span-4 ${importSuccess ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                  {importSuccess === false && <AlertTriangle className="h-4 w-4" />}
                  {importSuccess === true && <Zap className="h-4 w-4" />}
                  <AlertDescription>{importMessage}</AlertDescription>
                </Alert>
              )}
              
              <div className="col-span-4 text-xs text-muted-foreground">
                <p>Notes :</p>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                  <li>Utilisez uniquement des clés API en lecture seule pour plus de sécurité.</li>
                  <li>Vos données d'API sont chiffrées et stockées de manière sécurisée.</li>
                  <li>La synchronisation des trades peut prendre quelques minutes.</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                onClick={handleSubmitConnection}
                disabled={!brokerName || !apiKey || !secretKey || isConnecting || isImporting}
              >
                {isConnecting ? "Connexion en cours..." : "Connecter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

export default TradeEntry;
