
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';

interface JournalFilterTagsProps {
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
  tradeTypes: { long: boolean, short: boolean };
  setTradeTypes: (types: { long: boolean, short: boolean }) => void;
  selectedSymbols: string[];
  setSelectedSymbols: (symbols: string[]) => void;
  selectedStrategies: string[];
  setSelectedStrategies: (strategies: string[]) => void;
  resetFilters: () => void;
}

export function JournalFilterTags({
  dateRange,
  setDateRange,
  tradeTypes,
  setTradeTypes,
  selectedSymbols,
  setSelectedSymbols,
  selectedStrategies,
  setSelectedStrategies,
  resetFilters
}: JournalFilterTagsProps) {
  const hasActiveFilters = dateRange.from || selectedSymbols.length > 0 || 
                          selectedStrategies.length > 0 || !tradeTypes.long || !tradeTypes.short;
  
  if (!hasActiveFilters) return null;
  
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground">Filtres actifs:</span>
      
      {dateRange.from && (
        <div className="bg-secondary/50 text-sm rounded-full px-3 py-1 flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          {dateRange.to ? (
            <span>{format(dateRange.from, 'dd/MM/yy')} - {format(dateRange.to, 'dd/MM/yy')}</span>
          ) : (
            <span>Depuis {format(dateRange.from, 'dd/MM/yy')}</span>
          )}
          <button 
            onClick={() => setDateRange({from: undefined, to: undefined})}
            className="ml-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {!tradeTypes.long && tradeTypes.short && (
        <div className="bg-secondary/50 text-sm rounded-full px-3 py-1 flex items-center gap-1">
          <span>Short uniquement</span>
          <button 
            onClick={() => setTradeTypes({long: true, short: true})}
            className="ml-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {tradeTypes.long && !tradeTypes.short && (
        <div className="bg-secondary/50 text-sm rounded-full px-3 py-1 flex items-center gap-1">
          <span>Long uniquement</span>
          <button 
            onClick={() => setTradeTypes({long: true, short: true})}
            className="ml-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {selectedSymbols.length > 0 && (
        <div className="bg-secondary/50 text-sm rounded-full px-3 py-1 flex items-center gap-1">
          <span>{selectedSymbols.length > 1 ? `${selectedSymbols.length} symboles` : selectedSymbols[0]}</span>
          <button 
            onClick={() => setSelectedSymbols([])}
            className="ml-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {selectedStrategies.length > 0 && (
        <div className="bg-secondary/50 text-sm rounded-full px-3 py-1 flex items-center gap-1">
          <span>{selectedStrategies.length > 1 ? `${selectedStrategies.length} stratégies` : selectedStrategies[0]}</span>
          <button 
            onClick={() => setSelectedStrategies([])}
            className="ml-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      
      <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7">
        Effacer tout
      </Button>
    </div>
  );
}
