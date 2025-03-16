
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface JournalSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function JournalSearch({ searchTerm, setSearchTerm }: JournalSearchProps) {
  return (
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
  );
}
