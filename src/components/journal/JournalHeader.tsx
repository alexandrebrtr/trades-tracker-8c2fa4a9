
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Filter, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface JournalHeaderProps {
  dateRange: {from: Date | undefined, to: Date | undefined};
  setDateRange: (range: {from: Date | undefined, to: Date | undefined}) => void;
  setIsFilterDialogOpen: (isOpen: boolean) => void;
}

export function JournalHeader({ dateRange, setDateRange, setIsFilterDialogOpen }: JournalHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Journal de Trading</h1>
      <div className={`flex ${isMobile ? 'flex-col space-y-2 w-full' : 'items-center space-x-2'}`}>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size={isMobile ? "default" : "sm"}
              className={isMobile ? "w-full min-h-[44px] justify-start" : ""}
              aria-label="Sélectionner une plage de dates"
            >
              <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
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
              numberOfMonths={isMobile ? 1 : 2}
            />
            <div className="flex items-center justify-end gap-2 p-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setDateRange({from: undefined, to: undefined})}
                aria-label="Réinitialiser les dates"
              >
                Réinitialiser
              </Button>
              <Button 
                size="sm" 
                onClick={() => document.body.click()}
                aria-label="Appliquer la sélection de dates"
              >
                Appliquer
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          size={isMobile ? "default" : "sm"}
          onClick={() => setIsFilterDialogOpen(true)}
          className={isMobile ? "w-full min-h-[44px] justify-start" : ""}
          aria-label="Ouvrir les filtres"
        >
          <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Filtres</span>
        </Button>
        
        <Button 
          size={isMobile ? "default" : "sm"} 
          asChild
          className={isMobile ? "w-full min-h-[44px] justify-start" : ""}
        >
          <Link to="/trade-entry" aria-label="Ajouter une nouvelle entrée de trade">
            <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Nouvelle entrée</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
