import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, DollarSign, Clock, ArrowUp, ArrowDown, Info, UploadCloud } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const strategies = [
  'Day Trading',
  'Swing Trading',
  'Scalping',
  'Position Trading',
  'Breakout',
  'Trend Following',
  'Mean Reversion',
  'Arbitrage',
];

const assets = [
  { value: 'btc-usd', label: 'BTC/USD', type: 'Crypto' },
  { value: 'eth-usd', label: 'ETH/USD', type: 'Crypto' },
  { value: 'eur-usd', label: 'EUR/USD', type: 'Forex' },
  { value: 'gbp-usd', label: 'GBP/USD', type: 'Forex' },
  { value: 'aapl', label: 'Apple (AAPL)', type: 'Stock' },
  { value: 'msft', label: 'Microsoft (MSFT)', type: 'Stock' },
  { value: 'amzn', label: 'Amazon (AMZN)', type: 'Stock' },
  { value: 'tsla', label: 'Tesla (TSLA)', type: 'Stock' },
  { value: 'gold', label: 'Or (GOLD)', type: 'Commodity' },
  { value: 'silver', label: 'Argent (SILVER)', type: 'Commodity' },
];

const orderTypes = [
  'Market',
  'Limite',
  'Stop',
  'Stop Limite',
  'Trailing Stop',
];

export function TradeForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');
  const [asset, setAsset] = useState('');
  const [orderType, setOrderType] = useState('');
  const [strategy, setStrategy] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [size, setSize] = useState('');
  const [fees, setFees] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16); // Format yyyy-MM-ddThh:mm
    setEntryDate(formattedDate);
    setExitDate(formattedDate);
  }, []);

  const calculateResult = () => {
    if (entryPrice && exitPrice && size) {
      const entry = parseFloat(entryPrice.replace(',', '.'));
      const exit = parseFloat(exitPrice.replace(',', '.'));
      const positionSize = parseFloat(size.replace(',', '.'));
      const feesAmount = fees ? parseFloat(fees.replace(',', '.')) : 0;
      
      let calculatedResult;
      if (direction === 'long') {
        calculatedResult = (exit - entry) * positionSize - feesAmount;
      } else {
        calculatedResult = (entry - exit) * positionSize - feesAmount;
      }
      
      setResult(parseFloat(calculatedResult.toFixed(5)));
      return calculatedResult;
    } else {
      setResult(null);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour enregistrer un trade.",
        variant: "destructive",
      });
      return;
    }
    
    if (!asset || !orderType || !strategy || !entryPrice || !exitPrice || !size || !entryDate || !exitDate) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    const calculatedPnL = calculateResult();
    if (calculatedPnL === null) {
      toast({
        title: "Erreur de calcul",
        description: "Impossible de calculer le résultat du trade.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newTrade = {
        user_id: user.id,
        date: new Date(entryDate).toISOString(),
        symbol: assets.find(a => a.value === asset)?.label || asset,
        type: direction,
        strategy,
        entry_price: parseFloat(entryPrice.replace(',', '.')),
        exit_price: parseFloat(exitPrice.replace(',', '.')),
        size: parseFloat(size.replace(',', '.')),
        fees: fees ? parseFloat(fees.replace(',', '.')) : 0,
        pnl: calculatedPnL,
        notes: notes
      };
      
      const { error } = await supabase
        .from('trades')
        .insert([newTrade]);
      
      if (error) throw error;
      
      toast({
        title: "Trade enregistré",
        description: "Votre trade a été enregistré avec succès.",
      });
      
      setEntryPrice('');
      setExitPrice('');
      setSize('');
      setFees('');
      setNotes('');
      setResult(null);
      
      setTimeout(() => {
        navigate('/journal');
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du trade:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le trade. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6">Ajouter un nouveau trade</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="col-span-full mb-2">
          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              className={`flex-1 ${
                direction === 'long' 
                  ? 'bg-profit text-white hover:bg-profit/90' 
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
              onClick={() => setDirection('long')}
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              LONG
            </Button>
            <Button
              type="button"
              className={`flex-1 ${
                direction === 'short' 
                  ? 'bg-loss text-white hover:bg-loss/90' 
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
              onClick={() => setDirection('short')}
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              SHORT
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="entryDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Date et heure d'entrée
            </Label>
            <Input
              id="entryDate"
              type="datetime-local"
              className="mt-1"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="exitDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Date et heure de sortie
            </Label>
            <Input
              id="exitDate"
              type="datetime-local"
              className="mt-1"
              value={exitDate}
              onChange={(e) => setExitDate(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="asset" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Actif tradé
            </Label>
            <Select value={asset} onValueChange={setAsset} required>
              <SelectTrigger id="asset" className="mt-1">
                <SelectValue placeholder="Sélectionner un actif" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((assetItem) => (
                  <SelectItem key={assetItem.value} value={assetItem.value}>
                    {assetItem.label} ({assetItem.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="orderType" className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              Type d'ordre
            </Label>
            <Select value={orderType} onValueChange={setOrderType} required>
              <SelectTrigger id="orderType" className="mt-1">
                <SelectValue placeholder="Sélectionner un type d'ordre" />
              </SelectTrigger>
              <SelectContent>
                {orderTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="entryPrice" className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-muted-foreground" />
              Prix d'entrée
            </Label>
            <Input
              id="entryPrice"
              type="text"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0.00000"
              className="mt-1"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="exitPrice" className="flex items-center gap-2">
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
              Prix de sortie
            </Label>
            <Input
              id="exitPrice"
              type="text"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0.00000"
              className="mt-1"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="size" className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              Taille de position
            </Label>
            <Input
              id="size"
              type="text"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0.00000"
              className="mt-1"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="fees" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Frais de transaction
            </Label>
            <Input
              id="fees"
              type="text"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0.00000"
              className="mt-1"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="strategy" className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Stratégie utilisée
            </Label>
            <Select value={strategy} onValueChange={setStrategy} required>
              <SelectTrigger id="strategy" className="mt-1">
                <SelectValue placeholder="Sélectionner une stratégie" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map((strategyItem) => (
                  <SelectItem key={strategyItem} value={strategyItem}>
                    {strategyItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-1 border-dashed"
              onClick={() => calculateResult()}
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              Ajouter une capture d'écran
            </Button>
          </div>
        </div>
        
        <div className="col-span-full mt-2">
          <Label htmlFor="notes" className="flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            Notes personnelles
          </Label>
          <Textarea
            id="notes"
            placeholder="Réflexions, erreurs à éviter, détails de la stratégie..."
            className="mt-1 h-32"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        {result !== null && (
          <div className="col-span-full mt-2 p-4 rounded-lg border border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-1">Résultat calculé:</p>
            <p className={`text-xl font-semibold ${result >= 0 ? 'text-profit' : 'text-loss'}`}>
              {result >= 0 ? '+' : ''}{result.toFixed(5)} €
            </p>
          </div>
        )}
        
        <div className="col-span-full mt-6">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer le trade'}
          </Button>
        </div>
      </div>
    </form>
  );
}
