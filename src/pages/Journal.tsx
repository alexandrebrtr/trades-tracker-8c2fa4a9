
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Trade } from '@/components/journal/types';
import { TradeDetail } from '@/components/journal/TradeDetail';

// Import des nouveaux composants
import { JournalHeader } from '@/components/journal/JournalHeader';
import { JournalSearch } from '@/components/journal/JournalSearch';
import { JournalTabs } from '@/components/journal/JournalTabs';
import { JournalFilters } from '@/components/journal/JournalFilters';
import { JournalFilterTags } from '@/components/journal/JournalFilterTags';
import { JournalList } from '@/components/journal/JournalList';
import { JournalDeleteDialog } from '@/components/journal/JournalDeleteDialog';

export default function Journal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<Trade[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  // Filtres
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [sortBy, setSortBy] = useState('date-desc');
  const [tradeTypes, setTradeTypes] = useState<{long: boolean, short: boolean}>({
    long: true,
    short: true
  });
  const [symbols, setSymbols] = useState<string[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);

  // Récupérer les trades de l'utilisateur
  useEffect(() => {
    if (!user) return;
    fetchTrades();
  }, [user]);

  const fetchTrades = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const formattedTrades = data.map(t => ({
          ...t,
          date: t.date || new Date().toISOString(),
          type: t.type.toLowerCase() as 'long' | 'short',
          pnl: t.pnl || 0
        })) as Trade[];
        
        setEntries(formattedTrades);
        
        // Extraire les symboles et stratégies uniques pour les filtres
        const uniqueSymbols = [...new Set(formattedTrades.map(t => t.symbol))];
        const uniqueStrategies = [...new Set(formattedTrades.filter(t => t.strategy).map(t => t.strategy as string))];
        
        setSymbols(uniqueSymbols);
        setStrategies(uniqueStrategies);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des trades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Appliquer les filtres chaque fois que les critères de filtrage changent
  useEffect(() => {
    applyFilters();
  }, [entries, activeTab, searchTerm, dateRange, sortBy, tradeTypes, selectedSymbols, selectedStrategies]);

  const applyFilters = () => {
    let filtered = [...entries];
    
    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        (entry.symbol && entry.symbol.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.strategy && entry.strategy.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filtrer par onglet (profit/perte)
    if (activeTab === 'success') {
      filtered = filtered.filter(entry => entry.pnl > 0);
    } else if (activeTab === 'failure') {
      filtered = filtered.filter(entry => entry.pnl < 0);
    }
    
    // Filtrer par plage de dates
    if (dateRange.from) {
      filtered = filtered.filter(entry => new Date(entry.date) >= dateRange.from!);
    }
    if (dateRange.to) {
      const endDate = new Date(dateRange.to);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(entry => new Date(entry.date) <= endDate);
    }
    
    // Filtrer par type de trade
    if (!tradeTypes.long || !tradeTypes.short) {
      if (tradeTypes.long) {
        filtered = filtered.filter(entry => entry.type === 'long');
      } else if (tradeTypes.short) {
        filtered = filtered.filter(entry => entry.type === 'short');
      }
    }
    
    // Filtrer par symbole
    if (selectedSymbols.length > 0) {
      filtered = filtered.filter(entry => selectedSymbols.includes(entry.symbol));
    }
    
    // Filtrer par stratégie
    if (selectedStrategies.length > 0) {
      filtered = filtered.filter(entry => entry.strategy && selectedStrategies.includes(entry.strategy));
    }
    
    // Trier les résultats
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      switch (sortBy) {
        case 'date-asc':
          return dateA - dateB;
        case 'date-desc':
          return dateB - dateA;
        case 'pnl-asc':
          return a.pnl - b.pnl;
        case 'pnl-desc':
          return b.pnl - a.pnl;
        case 'symbol-asc':
          return a.symbol.localeCompare(b.symbol);
        case 'symbol-desc':
          return b.symbol.localeCompare(a.symbol);
        default:
          return dateB - dateA;
      }
    });
    
    setFilteredEntries(filtered);
  };

  const handleDeleteTrade = async () => {
    if (!tradeToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', tradeToDelete)
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      // Mettre à jour la liste des trades
      setEntries(entries.filter(entry => entry.id !== tradeToDelete));
      
      setIsDeleteDialogOpen(false);
      toast({
        title: "Trade supprimé",
        description: "Le trade a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du trade:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du trade.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setTradeToDelete(null);
    }
  };

  const handleUpdateTrade = (updatedTrade: Trade) => {
    // Mettre à jour l'entrée dans la liste des trades
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === updatedTrade.id ? updatedTrade : entry
      )
    );
    setSelectedTrade(updatedTrade);
  };

  const openDeleteDialog = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setTradeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenTradeDetail = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsDialogOpen(true);
  };

  const handleCloseTradeDetail = () => {
    setIsDialogOpen(false);
  };
  
  const resetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setSortBy('date-desc');
    setTradeTypes({ long: true, short: true });
    setSelectedSymbols([]);
    setSelectedStrategies([]);
    setIsFilterDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <JournalHeader 
          dateRange={dateRange} 
          setDateRange={setDateRange}
          setIsFilterDialogOpen={setIsFilterDialogOpen}
        />
        
        <div className="grid gap-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <JournalSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <JournalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          <JournalFilterTags 
            dateRange={dateRange}
            setDateRange={setDateRange}
            tradeTypes={tradeTypes}
            setTradeTypes={setTradeTypes}
            selectedSymbols={selectedSymbols}
            setSelectedSymbols={setSelectedSymbols}
            selectedStrategies={selectedStrategies}
            setSelectedStrategies={setSelectedStrategies}
            resetFilters={resetFilters}
          />
          
          <JournalList
            entries={filteredEntries}
            isLoading={isLoading}
            onOpenTradeDetail={handleOpenTradeDetail}
            onDeleteClick={openDeleteDialog}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl p-0">
          {selectedTrade && (
            <TradeDetail 
              trade={selectedTrade} 
              onClose={handleCloseTradeDetail}
              onUpdate={handleUpdateTrade}
              onDelete={(id) => {
                setIsDialogOpen(false);
                setTimeout(() => {
                  setTradeToDelete(id);
                  setIsDeleteDialogOpen(true);
                }, 100);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      <JournalDeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirmDelete={handleDeleteTrade}
        isDeleting={isDeleting}
        onCancel={() => setTradeToDelete(null)}
      />
      
      <JournalFilters
        isOpen={isFilterDialogOpen}
        setIsOpen={setIsFilterDialogOpen}
        sortBy={sortBy}
        setSortBy={setSortBy}
        tradeTypes={tradeTypes}
        setTradeTypes={setTradeTypes}
        symbols={symbols}
        selectedSymbols={selectedSymbols}
        setSelectedSymbols={setSelectedSymbols}
        strategies={strategies}
        selectedStrategies={selectedStrategies}
        setSelectedStrategies={setSelectedStrategies}
        resetFilters={resetFilters}
      />
    </AppLayout>
  );
}
