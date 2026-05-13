
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, DollarSign, Clock, ArrowUp, ArrowDown, Info, Calculator, Search, Flag, Target, Layers, Sigma } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { blackScholes, yearsTo } from '@/utils/blackScholes';

const ASSET_CLASSES = [
  { value: 'forex', label: 'Forex' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'stocks', label: 'Actions' },
  { value: 'etf', label: 'ETF' },
  { value: 'indices', label: 'Indices' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'spot', label: 'Spot' },
  { value: 'cfd', label: 'CFD' },
  { value: 'futures', label: 'Futures' },
  { value: 'forwards', label: 'Forwards' },
  { value: 'options', label: 'Options' },
];

const strategies = [
  'Day Trading',
  'Swing Trading',
  'Scalping',
  'Position Trading',
  'Breakout',
  'Trend Following',
  'Mean Reversion',
  'Arbitrage',
  'custom'
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
  { value: 'custom', label: 'Rechercher...', type: 'Autre' },
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
  const [customAsset, setCustomAsset] = useState('');
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
  const [manualPnL, setManualPnL] = useState('');
  const [useManualPnL, setUseManualPnL] = useState(false);
  const [isCustomAsset, setIsCustomAsset] = useState(false);
  const [customStrategy, setCustomStrategy] = useState('');
  const [isCustomStrategy, setIsCustomStrategy] = useState(false);
  
  // Adding the missing state variables for stop loss and take profit
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [useStopLoss, setUseStopLoss] = useState(false);
  const [useTakeProfit, setUseTakeProfit] = useState(false);

  // Multi-asset / Options state
  const [assetClass, setAssetClass] = useState<string>('crypto');
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [strike, setStrike] = useState('');
  const [expiration, setExpiration] = useState('');
  const [impliedVol, setImpliedVol] = useState(''); // % e.g. 25
  const [premium, setPremium] = useState('');
  const [contractSize, setContractSize] = useState('100');
  const [riskFreeRate, setRiskFreeRate] = useState('4'); // %
  const [underlyingPrice, setUnderlyingPrice] = useState('');
  const [autoGreeks, setAutoGreeks] = useState(true);
  const [delta, setDelta] = useState('');
  const [gamma, setGamma] = useState('');
  const [theta, setTheta] = useState('');
  const [vega, setVega] = useState('');
  const [rho, setRho] = useState('');

  const isOptions = assetClass === 'options';

  const computedGreeks = useMemo(() => {
    if (!isOptions) return null;
    const S = parseFloat((underlyingPrice || entryPrice || '0').replace(',', '.'));
    const K = parseFloat((strike || '0').replace(',', '.'));
    const T = expiration ? yearsTo(expiration) : 0;
    const r = parseFloat((riskFreeRate || '0').replace(',', '.')) / 100;
    const sigma = parseFloat((impliedVol || '0').replace(',', '.')) / 100;
    if (!S || !K || !T || !sigma) return null;
    return blackScholes({ S, K, T, r, sigma, type: optionType });
  }, [isOptions, underlyingPrice, entryPrice, strike, expiration, riskFreeRate, impliedVol, optionType]);

  useEffect(() => {
    if (isOptions && autoGreeks && computedGreeks) {
      setDelta(computedGreeks.delta.toFixed(4));
      setGamma(computedGreeks.gamma.toFixed(6));
      setTheta(computedGreeks.theta.toFixed(4));
      setVega(computedGreeks.vega.toFixed(4));
      setRho(computedGreeks.rho.toFixed(4));
    }
  }, [isOptions, autoGreeks, computedGreeks]);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16); // Format yyyy-MM-ddThh:mm
    setEntryDate(formattedDate);
    setExitDate(formattedDate);
  }, []);

  useEffect(() => {
    if (asset === 'custom') {
      setIsCustomAsset(true);
    } else {
      setIsCustomAsset(false);
    }
  }, [asset]);

  useEffect(() => {
    if (strategy === 'custom') {
      setIsCustomStrategy(true);
    } else {
      setIsCustomStrategy(false);
    }
  }, [strategy]);

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
    
    if (!asset || (asset === 'custom' && !customAsset) || !orderType || !strategy || (strategy === 'custom' && !customStrategy) || !entryPrice || !exitPrice || !size || !entryDate || !exitDate) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const entry = parseFloat(entryPrice.replace(',', '.'));
      const exit = parseFloat(exitPrice.replace(',', '.'));
      const positionSize = parseFloat(size.replace(',', '.'));
      const feesAmount = fees ? parseFloat(fees.replace(',', '.')) : 0;
      
      let finalPnL;
      if (useManualPnL && manualPnL) {
        finalPnL = parseFloat(manualPnL.replace(',', '.'));
      } else {
        if (direction === 'long') {
          finalPnL = (exit - entry) * positionSize - feesAmount;
        } else {
          finalPnL = (entry - exit) * positionSize - feesAmount;
        }
      }
      
      let symbolToUse;
      if (asset === 'custom') {
        symbolToUse = customAsset.trim();
      } else {
        symbolToUse = assets.find(a => a.value === asset)?.label || asset;
      }
      
      let strategyToUse;
      if (strategy === 'custom') {
        strategyToUse = customStrategy.trim();
      } else {
        strategyToUse = strategy;
      }
      
      // Parse stop loss and take profit values if they're enabled
      const stopLossValue = useStopLoss && stopLoss ? parseFloat(stopLoss.replace(',', '.')) : null;
      const takeProfitValue = useTakeProfit && takeProfit ? parseFloat(takeProfit.replace(',', '.')) : null;
      
      const num = (s: string) => s ? parseFloat(s.replace(',', '.')) : null;
      const newTrade: any = {
        user_id: user.id,
        date: new Date(entryDate).toISOString(),
        symbol: symbolToUse,
        type: direction,
        strategy: strategyToUse,
        entry_price: entry,
        exit_price: exit,
        size: positionSize,
        fees: feesAmount,
        pnl: finalPnL,
        notes: notes,
        stop_loss: stopLossValue,
        take_profit: takeProfitValue,
        asset_class: assetClass,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (isOptions) {
        newTrade.option_type = optionType;
        newTrade.strike = num(strike);
        newTrade.expiration = expiration ? new Date(expiration).toISOString() : null;
        newTrade.implied_volatility = impliedVol ? parseFloat(impliedVol.replace(',', '.')) / 100 : null;
        newTrade.premium = num(premium);
        newTrade.contract_size = num(contractSize) ?? 100;
        newTrade.risk_free_rate = riskFreeRate ? parseFloat(riskFreeRate.replace(',', '.')) / 100 : 0.04;
        newTrade.underlying_price = num(underlyingPrice);
        newTrade.delta = num(delta);
        newTrade.gamma = num(gamma);
        newTrade.theta = num(theta);
        newTrade.vega = num(vega);
        newTrade.rho = num(rho);
      }
      
      console.log("Submitting trade:", newTrade);
      
      const { data, error } = await supabase
        .from('trades')
        .insert([newTrade])
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Trade added successfully:", data);
      
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
      setManualPnL('');
      setUseManualPnL(false);
      setStopLoss('');
      setTakeProfit('');
      setUseStopLoss(false);
      setUseTakeProfit(false);
      
      setTimeout(() => {
        navigate('/journal');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement du trade:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer le trade. Veuillez réessayer.",
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
        <div className="col-span-full">
          <Label htmlFor="assetClass" className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            Classe d'actif
          </Label>
          <Select value={assetClass} onValueChange={setAssetClass}>
            <SelectTrigger id="assetClass" className="mt-1">
              <SelectValue placeholder="Sélectionner une classe d'actif" />
            </SelectTrigger>
            <SelectContent>
              {ASSET_CLASSES.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Le formulaire s'adapte au type d'actif. Les options affichent une section dédiée aux Greeks.
          </p>
        </div>

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
            <Select value={asset} onValueChange={(value) => {
              setAsset(value);
              if (value === 'custom') {
                setIsCustomAsset(true);
              } else {
                setIsCustomAsset(false);
              }
            }} required>
              <SelectTrigger id="asset" className="mt-1">
                <SelectValue placeholder="Sélectionner un actif" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((assetItem) => (
                  <SelectItem key={assetItem.value} value={assetItem.value}>
                    {assetItem.label} {assetItem.value !== 'custom' && `(${assetItem.type})`}
                    {assetItem.value === 'custom' && <Search className="w-3.5 h-3.5 ml-1 inline" />}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isCustomAsset && (
              <div className="mt-2">
                <Label htmlFor="customAsset" className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  Nom de l'actif
                </Label>
                <Input
                  id="customAsset"
                  type="text"
                  placeholder="Saisir le nom de l'actif..."
                  className="mt-1"
                  value={customAsset}
                  onChange={(e) => setCustomAsset(e.target.value)}
                  required={isCustomAsset}
                />
              </div>
            )}
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
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="stopLoss" className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-muted-foreground" />
                Stop Loss
              </Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="useStopLoss"
                  checked={useStopLoss}
                  onCheckedChange={setUseStopLoss}
                />
                <Label htmlFor="useStopLoss" className="text-xs text-muted-foreground">
                  {useStopLoss ? 'Activé' : 'Désactivé'}
                </Label>
              </div>
            </div>
            <Input
              id="stopLoss"
              type="text"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0.00000"
              className={`mt-1 ${!useStopLoss ? 'opacity-50' : ''}`}
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              disabled={!useStopLoss}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="takeProfit" className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                Take Profit
              </Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="useTakeProfit"
                  checked={useTakeProfit}
                  onCheckedChange={setUseTakeProfit}
                />
                <Label htmlFor="useTakeProfit" className="text-xs text-muted-foreground">
                  {useTakeProfit ? 'Activé' : 'Désactivé'}
                </Label>
              </div>
            </div>
            <Input
              id="takeProfit"
              type="text"
              pattern="[0-9]*[.,]?[0-9]*"
              placeholder="0.00000"
              className={`mt-1 ${!useTakeProfit ? 'opacity-50' : ''}`}
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              disabled={!useTakeProfit}
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
            <Select value={strategy} onValueChange={(value) => {
              setStrategy(value);
              if (value === 'custom') {
                setIsCustomStrategy(true);
              } else {
                setIsCustomStrategy(false);
              }
            }} required>
              <SelectTrigger id="strategy" className="mt-1">
                <SelectValue placeholder="Sélectionner une stratégie" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map((strategyItem) => (
                  <SelectItem key={strategyItem} value={strategyItem}>
                    {strategyItem}
                    {strategyItem === 'custom' && <Search className="w-3.5 h-3.5 ml-1 inline" />}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isCustomStrategy && (
              <div className="mt-2">
                <Label htmlFor="customStrategy" className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  Nom de la stratégie
                </Label>
                <Input
                  id="customStrategy"
                  type="text"
                  placeholder="Saisir le nom de la stratégie..."
                  className="mt-1"
                  value={customStrategy}
                  onChange={(e) => setCustomStrategy(e.target.value)}
                  required={isCustomStrategy}
                />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="manualPnL" className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-muted-foreground" />
                P&L Manuel
              </Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="useManualPnL"
                  checked={useManualPnL}
                  onCheckedChange={setUseManualPnL}
                />
                <Label htmlFor="useManualPnL" className="text-xs text-muted-foreground">
                  {useManualPnL ? 'Activé' : 'Désactivé'}
                </Label>
              </div>
            </div>
            <Input
              id="manualPnL"
              type="text"
              pattern="[+-]?[0-9]*[.,]?[0-9]*"
              placeholder="0.00000"
              className={`mt-1 ${!useManualPnL ? 'opacity-50' : ''}`}
              value={manualPnL}
              onChange={(e) => setManualPnL(e.target.value)}
              disabled={!useManualPnL}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Entrez manuellement le profit/perte si le calcul automatique ne correspond pas à vos résultats réels.
            </p>
          </div>
        </div>
        
        {isOptions && (
          <div className="col-span-full mt-4 p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-4">
            <div className="flex items-center gap-2">
              <Sigma className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Options & Greeks</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Type d'option</Label>
                <Select value={optionType} onValueChange={(v: 'call' | 'put') => setOptionType(v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="put">Put</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Strike</Label>
                <Input className="mt-1" value={strike} onChange={e => setStrike(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label>Expiration</Label>
                <Input className="mt-1" type="date" value={expiration} onChange={e => setExpiration(e.target.value)} />
              </div>
              <div>
                <Label>Volatilité implicite (%)</Label>
                <Input className="mt-1" value={impliedVol} onChange={e => setImpliedVol(e.target.value)} placeholder="25" />
              </div>
              <div>
                <Label>Prime</Label>
                <Input className="mt-1" value={premium} onChange={e => setPremium(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label>Taille du contrat</Label>
                <Input className="mt-1" value={contractSize} onChange={e => setContractSize(e.target.value)} placeholder="100" />
              </div>
              <div>
                <Label>Prix du sous-jacent</Label>
                <Input className="mt-1" value={underlyingPrice} onChange={e => setUnderlyingPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label>Taux sans risque (%)</Label>
                <Input className="mt-1" value={riskFreeRate} onChange={e => setRiskFreeRate(e.target.value)} placeholder="4" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <Label className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Greeks calculés (Black-Scholes)
              </Label>
              <div className="flex items-center gap-2">
                <Switch checked={autoGreeks} onCheckedChange={setAutoGreeks} id="autoGreeks" />
                <Label htmlFor="autoGreeks" className="text-xs text-muted-foreground">
                  {autoGreeks ? 'Auto' : 'Manuel'}
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Δ Delta', value: delta, set: setDelta },
                { label: 'Γ Gamma', value: gamma, set: setGamma },
                { label: 'Θ Theta', value: theta, set: setTheta },
                { label: 'ν Vega', value: vega, set: setVega },
                { label: 'ρ Rho', value: rho, set: setRho },
              ].map(g => (
                <div key={g.label}>
                  <Label className="text-xs">{g.label}</Label>
                  <Input
                    className="mt-1"
                    value={g.value}
                    onChange={e => g.set(e.target.value)}
                    disabled={autoGreeks}
                    placeholder="—"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
        
        {!useManualPnL && result !== null && (
          <div className="col-span-full mt-2 p-4 rounded-lg border border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-1">Résultat calculé:</p>
            <p className={`text-xl font-semibold ${result >= 0 ? 'text-profit' : 'text-loss'}`}>
              {result >= 0 ? '+' : ''}{result.toFixed(5)} €
            </p>
          </div>
        )}
        
        {!useManualPnL && (
          <div className="col-span-full flex justify-center">
            <Button
              type="button"
              variant="outline"
              className="px-6"
              onClick={calculateResult}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculer le résultat
            </Button>
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
