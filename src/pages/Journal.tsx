
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  PlusCircle, 
  Search,
  X,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TradeDetail, Trade } from '@/components/journal/TradeDetail';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type EntryStatus = 'success' | 'failure' | 'mixed';

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Journal de Trading</h1>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd/MM/yy')} - {format(dateRange.to, 'dd/MM/yy')}
                      </>
                    ) : (
                      format(dateRange.from, 'dd/MM/yy')
                    )
                  ) : (
                    <span>Par date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange as any}
                  locale={fr}
                  numberOfMonths={2}
                />
                <div className="flex items-center justify-end gap-2 p-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setDateRange({from: undefined, to: undefined})}
                  >
                    Réinitialiser
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => document.body.click()}
                  >
                    Appliquer
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Filtres</span>
                </Button>
              </DialogTrigger>
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
                            setTradeTypes(prev => ({...prev, long: checked === true}))
                          }
                        />
                        <Label htmlFor="filter-long">Long</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-short" 
                          checked={tradeTypes.short} 
                          onCheckedChange={(checked) => 
                            setTradeTypes(prev => ({...prev, short: checked === true}))
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
                                  setSelectedSymbols(prev => [...prev, symbol]);
                                } else {
                                  setSelectedSymbols(prev => prev.filter(s => s !== symbol));
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
                                  setSelectedStrategies(prev => [...prev, strategy]);
                                } else {
                                  setSelectedStrategies(prev => prev.filter(s => s !== strategy));
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
                    <Button onClick={() => setIsFilterDialogOpen(false)}>
                      Appliquer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button size="sm" asChild>
              <Link to="/trade-entry">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Nouvelle entrée</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher dans votre journal..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            
            <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid w-full sm:w-auto grid-cols-3">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="success">Gains</TabsTrigger>
                <TabsTrigger value="failure">Pertes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Afficher les filtres actifs */}
          {(dateRange.from || selectedSymbols.length > 0 || selectedStrategies.length > 0 || 
           !tradeTypes.long || !tradeTypes.short) && (
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
          )}
          
          <div className="grid gap-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Chargement des données...</span>
              </div>
            ) : filteredEntries.length > 0 ? (
              filteredEntries.map(entry => (
                <JournalEntryCard 
                  key={entry.id} 
                  entry={entry} 
                  onClick={() => handleOpenTradeDetail(entry)}
                  onDelete={(e) => openDeleteDialog(entry.id, e)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune entrée trouvée.</p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link to="/trade-entry">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Créer une entrée
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          {filteredEntries.length > 5 && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="px-4">
                Page 1 sur {Math.ceil(filteredEntries.length / 5)}
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl p-0">
          {selectedTrade && (
            <TradeDetail 
              trade={selectedTrade} 
              onClose={handleCloseTradeDetail} 
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce trade</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce trade ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTradeToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTrade} 
              className="bg-loss hover:bg-loss/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}

interface JournalEntryCardProps {
  entry: Trade;
  onClick: () => void;
  onDelete: (event: React.MouseEvent) => void;
}

function JournalEntryCard({ entry, onClick, onDelete }: JournalEntryCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Extraire des leçons apprises des notes
  const extractLessons = (notes: string | null): string[] => {
    if (!notes) return [];
    
    // Chercher des lignes qui commencent par "-", "•", "*" ou "Leçon:"
    const lessons: string[] = [];
    const lines = notes.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('-') || 
          trimmedLine.startsWith('•') || 
          trimmedLine.startsWith('*') ||
          trimmedLine.toLowerCase().startsWith('leçon')) {
        lessons.push(trimmedLine.replace(/^[-•*]\s*/, ''));
      }
    }
    
    return lessons.slice(0, 3); // Limiter à 3 leçons
  };

  const lessons = extractLessons(entry.notes);

  return (
    <Card className={cn(
      "border-l-4 transition-all hover:shadow-md cursor-pointer",
      entry.pnl && entry.pnl > 0 ? "border-l-profit" : 
      entry.pnl && entry.pnl < 0 ? "border-l-loss" : 
      "border-l-neutral"
    )} onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{entry.symbol}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                entry.type === 'long' ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
              )}>
                {entry.type === 'long' ? 'LONG' : 'SHORT'}
              </span>
              <span className="text-sm text-muted-foreground">{entry.strategy}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              "text-lg font-semibold",
              entry.pnl && entry.pnl > 0 ? "text-profit" : 
              entry.pnl && entry.pnl < 0 ? "text-loss" : ""
            )}>
              {entry.pnl !== null ? (entry.pnl > 0 ? '+' : '') + `${entry.pnl.toFixed(2)} €` : '--'}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(entry.date)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entry.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Notes:</p>
              <p className="text-sm line-clamp-2">{entry.notes}</p>
            </div>
          )}
          
          {lessons.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Leçons apprises:</p>
              <ul className="text-sm list-disc list-inside space-y-1">
                {lessons.map((lesson, index) => (
                  <li key={index} className="line-clamp-1">{lesson}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm">Voir les détails</Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-loss hover:bg-loss/10"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
