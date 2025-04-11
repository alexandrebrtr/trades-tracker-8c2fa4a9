
import { useState } from 'react';
import { Trade } from '@/components/journal/types';
import { JournalEntryCard } from '@/components/journal/JournalEntryCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface JournalListProps {
  entries: Trade[];
  isLoading: boolean;
  onOpenTradeDetail: (trade: Trade) => void;
  onDeleteClick: (id: string, e: React.MouseEvent) => void;
}

export function JournalList({ entries, isLoading, onOpenTradeDetail, onDeleteClick }: JournalListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const entriesPerPage = isMobile ? 3 : 5;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chargement des données...</span>
      </div>
    );
  }
  
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Aucune entrée trouvée.</p>
        <Button className="w-full sm:w-auto" variant="outline" asChild>
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
    <div className="grid gap-4">
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
            size={isMobile ? "default" : "icon"} 
            onClick={prevPage}
            disabled={currentPage === 1}
            className={isMobile ? "px-3" : ""}
          >
            <ChevronLeft className="h-4 w-4" />
            {isMobile && <span className="ml-1">Précédent</span>}
          </Button>
          
          {!isMobile && (
            <Button variant="outline" size="sm" className="px-4">
              Page {currentPage} sur {totalPages}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size={isMobile ? "default" : "icon"} 
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={isMobile ? "px-3" : ""}
          >
            {isMobile && <span className="mr-1">Suivant</span>}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
