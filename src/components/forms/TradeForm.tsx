
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, DollarSign, Clock, ArrowUp, ArrowDown, Info, UploadCloud } from 'lucide-react';

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
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [size, setSize] = useState('');
  const [fees, setFees] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [direction, setDirection] = useState<'long' | 'short'>('long');

  // Calculate result when inputs change
  const calculateResult = () => {
    if (entryPrice && exitPrice && size) {
      const entry = parseFloat(entryPrice);
      const exit = parseFloat(exitPrice);
      const positionSize = parseFloat(size);
      const feesAmount = fees ? parseFloat(fees) : 0;
      
      let calculatedResult;
      if (direction === 'long') {
        calculatedResult = (exit - entry) * positionSize - feesAmount;
      } else {
        calculatedResult = (entry - exit) * positionSize - feesAmount;
      }
      
      setResult(parseFloat(calculatedResult.toFixed(2)));
    } else {
      setResult(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateResult();
    // Here you would normally save the trade to a database
    console.log('Trade submitted');
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
        
        {/* Date & Time section */}
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
              required
            />
          </div>
        </div>
        
        {/* Asset & Order Type section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="asset" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Actif tradé
            </Label>
            <Select required>
              <SelectTrigger id="asset" className="mt-1">
                <SelectValue placeholder="Sélectionner un actif" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.value} value={asset.value}>
                    {asset.label} ({asset.type})
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
            <Select required>
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
        
        {/* Price & Size section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="entryPrice" className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-muted-foreground" />
              Prix d'entrée
            </Label>
            <Input
              id="entryPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
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
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
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
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="mt-1"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* Fees & Strategy section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="fees" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Frais de transaction
            </Label>
            <Input
              id="fees"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
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
            <Select required>
              <SelectTrigger id="strategy" className="mt-1">
                <SelectValue placeholder="Sélectionner une stratégie" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map((strategy) => (
                  <SelectItem key={strategy} value={strategy}>
                    {strategy}
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
        
        {/* Notes section */}
        <div className="col-span-full mt-2">
          <Label htmlFor="notes" className="flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            Notes personnelles
          </Label>
          <Textarea
            id="notes"
            placeholder="Réflexions, erreurs à éviter, détails de la stratégie..."
            className="mt-1 h-32"
          />
        </div>
        
        {/* Result display */}
        {result !== null && (
          <div className="col-span-full mt-2 p-4 rounded-lg border border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-1">Résultat calculé:</p>
            <p className={`text-xl font-semibold ${result >= 0 ? 'text-profit' : 'text-loss'}`}>
              {result >= 0 ? '+' : ''}{result.toFixed(2)} €
            </p>
          </div>
        )}
        
        {/* Submit button */}
        <div className="col-span-full mt-6">
          <Button type="submit" className="w-full">
            Enregistrer le trade
          </Button>
        </div>
      </div>
    </form>
  );
}
