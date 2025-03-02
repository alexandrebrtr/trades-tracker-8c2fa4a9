
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  PlusCircle, 
  Search 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type EntryStatus = 'success' | 'failure' | 'mixed';

interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  symbol: string;
  strategy: string;
  entryPrice: number;
  exitPrice: number;
  status: EntryStatus;
  pnl: number;
  notes: string;
  lessons: string[];
  hasScreenshots: boolean;
}

// Mock data for demonstrations
const mockEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date(2023, 5, 10),
    title: 'Swing Trade sur Bitcoin',
    symbol: 'BTC/USD',
    strategy: 'Swing Trading',
    entryPrice: 42000,
    exitPrice: 45000,
    status: 'success',
    pnl: 1450,
    notes: "Entrée réussie sur un support majeur avec volume important.",
    lessons: ["Attendre la confirmation du support", "Ne pas hésiter à prendre des profits partiels"],
    hasScreenshots: true
  },
  {
    id: '2',
    date: new Date(2023, 5, 12),
    title: 'Scalping sur EUR/USD',
    symbol: 'EUR/USD',
    strategy: 'Scalping',
    entryPrice: 1.1245,
    exitPrice: 1.1220,
    status: 'failure',
    pnl: -150,
    notes: "Entrée précipitée sans attendre la confirmation du signal.",
    lessons: ["Toujours attendre la confirmation", "Respecter strictement le plan de trading"],
    hasScreenshots: true
  },
  {
    id: '3',
    date: new Date(2023, 5, 15),
    title: 'Position Apple avant résultats',
    symbol: 'AAPL',
    strategy: 'Event Trading',
    entryPrice: 180.25,
    exitPrice: 192.50,
    status: 'success',
    pnl: 2450,
    notes: "Bonne analyse des attentes du marché, entrée une semaine avant l'annonce.",
    lessons: ["La préparation en amont paie", "Ne pas être trop gourmand sur l'objectif"],
    hasScreenshots: false
  },
];

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.strategy.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'success') return matchesSearch && entry.status === 'success';
    if (activeTab === 'failure') return matchesSearch && entry.status === 'failure';
    
    return matchesSearch;
  });

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
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Nouvelle entrée</span>
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
            {filteredEntries.length > 0 ? (
              filteredEntries.map(entry => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune entrée trouvée.</p>
                <Button className="mt-4" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Créer une entrée
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
    </AppLayout>
  );
}

function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className={cn(
      "border-l-4 transition-all hover:shadow-md",
      entry.status === 'success' ? "border-l-profit" : 
      entry.status === 'failure' ? "border-l-loss" : 
      "border-l-neutral"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{entry.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium">{entry.symbol}</span>
              <span className="text-sm text-muted-foreground">{entry.strategy}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              "text-lg font-semibold",
              entry.status === 'success' ? "text-profit" : 
              entry.status === 'failure' ? "text-loss" : ""
            )}>
              {entry.pnl > 0 ? '+' : ''}{entry.pnl} €
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(entry.date)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Notes:</p>
            <p className="text-sm">{entry.notes}</p>
          </div>
          
          {entry.lessons.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Leçons apprises:</p>
              <ul className="text-sm list-disc list-inside space-y-1">
                {entry.lessons.map((lesson, index) => (
                  <li key={index}>{lesson}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Voir les détails</Button>
              {entry.hasScreenshots && (
                <Button variant="ghost" size="sm">Voir les captures</Button>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
