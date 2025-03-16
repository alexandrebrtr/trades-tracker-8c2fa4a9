
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface JournalFiltersProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  tradeTypes: {long: boolean, short: boolean};
  setTradeTypes: (types: {long: boolean, short: boolean}) => void;
  symbols: string[];
  selectedSymbols: string[];
  setSelectedSymbols: (symbols: string[]) => void;
  strategies: string[];
  selectedStrategies: string[];
  setSelectedStrategies: (strategies: string[]) => void;
  resetFilters: () => void;
}

export function JournalFilters({
  isOpen,
  setIsOpen,
  sortBy,
  setSortBy,
  tradeTypes,
  setTradeTypes,
  symbols,
  selectedSymbols,
  setSelectedSymbols,
  strategies,
  selectedStrategies,
  setSelectedStrategies,
  resetFilters
}: JournalFiltersProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4 py-2">
          <div>
            <h4 className="text-sm font-medium mb-2">Trier par</h4>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le tri" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (récent → ancien)</SelectItem>
                <SelectItem value="date-asc">Date (ancien → récent)</SelectItem>
                <SelectItem value="pnl-desc">P&L (élevé → bas)</SelectItem>
                <SelectItem value="pnl-asc">P&L (bas → élevé)</SelectItem>
                <SelectItem value="symbol-asc">Symbole (A → Z)</SelectItem>
                <SelectItem value="symbol-desc">Symbole (Z → A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Type de trade</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-long" 
                  checked={tradeTypes.long} 
                  onCheckedChange={(checked) => 
                    setTradeTypes({...tradeTypes, long: checked === true})
                  }
                />
                <Label htmlFor="filter-long">Long</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filter-short" 
                  checked={tradeTypes.short} 
                  onCheckedChange={(checked) => 
                    setTradeTypes({...tradeTypes, short: checked === true})
                  }
                />
                <Label htmlFor="filter-short">Short</Label>
              </div>
            </div>
          </div>
          
          {symbols.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Symboles</h4>
              <div className="grid grid-cols-2 gap-2">
                {symbols.map(symbol => (
                  <div key={symbol} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`symbol-${symbol}`} 
                      checked={selectedSymbols.includes(symbol)} 
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSymbols([...selectedSymbols, symbol]);
                        } else {
                          setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
                        }
                      }}
                    />
                    <Label htmlFor={`symbol-${symbol}`}>{symbol}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {strategies.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Stratégies</h4>
              <div className="grid grid-cols-1 gap-2">
                {strategies.map(strategy => (
                  <div key={strategy} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`strategy-${strategy}`} 
                      checked={selectedStrategies.includes(strategy)} 
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStrategies([...selectedStrategies, strategy]); // Fixed: was using setSelectedSymbols
                        } else {
                          setSelectedStrategies(selectedStrategies.filter(s => s !== strategy));
                        }
                      }}
                    />
                    <Label htmlFor={`strategy-${strategy}`}>{strategy}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Appliquer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
