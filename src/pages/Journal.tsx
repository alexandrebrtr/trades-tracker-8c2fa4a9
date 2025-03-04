
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  PlusCircle, 
  Search,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TradeDetail, Trade } from '@/components/journal/TradeDetail';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

type EntryStatus = 'success' | 'failure' | 'mixed';

export default function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Récupérer les trades de l'utilisateur
  useEffect(() => {
    if (!user) return;

    const fetchTrades = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('trades')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des trades:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrades();
  }, [user]);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      (entry.symbol && entry.symbol.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.strategy && entry.strategy.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'success') return matchesSearch && (entry.pnl !== null && entry.pnl > 0);
    if (activeTab === 'failure') return matchesSearch && (entry.pnl !== null && entry.pnl < 0);
    
    return matchesSearch;
  });

  const handleOpenTradeDetail = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsDialogOpen(true);
  };

  const handleCloseTradeDetail = () => {
    setIsDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="page-transition space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Journal de Trading</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Par date</span>
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              <span>Filtrer</span>
            </Button>
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
          
          {filteredEntries.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="px-4">
                Page 1 sur 1
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
            <TradeDetail trade={selectedTrade} onClose={handleCloseTradeDetail} />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

interface JournalEntryCardProps {
  entry: Trade;
  onClick: () => void;
}

function JournalEntryCard({ entry, onClick }: JournalEntryCardProps) {
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
