
import { useState } from 'react';
import { Trade } from '@/components/journal/types';
import { JournalEntryCard } from '@/components/journal/JournalEntryCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JournalListProps {
  entries: Trade[];
  isLoading: boolean;
  onOpenTradeDetail: (trade: Trade) => void;
  onDeleteClick: (id: string, e: React.MouseEvent) => void;
}

export function JournalList({ entries, isLoading, onOpenTradeDetail, onDeleteClick }: JournalListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement des données...</span>
      </div>
    );
  }
  
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune entrée trouvée.</p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/trade-entry">
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une entrée
          </Link>
        </Button>
      </div>
    );
  }
  
  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(entries.length / entriesPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div className="grid gap-6">
      {currentEntries.map(entry => (
        <JournalEntryCard
          key={entry.id}
          entry={entry}
          onClick={() => onOpenTradeDetail(entry)}
          onDelete={(e) => onDeleteClick(entry.id, e)}
        />
      ))}
      
      {entries.length > entriesPerPage && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="px-4">
            Page {currentPage} sur {totalPages}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
