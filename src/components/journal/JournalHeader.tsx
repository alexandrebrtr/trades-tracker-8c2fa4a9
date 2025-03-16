
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Filter, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface JournalHeaderProps {
  dateRange: {from: Date | undefined, to: Date | undefined};
  setDateRange: (range: {from: Date | undefined, to: Date | undefined}) => void;
  setIsFilterDialogOpen: (isOpen: boolean) => void;
}

export function JournalHeader({ dateRange, setDateRange, setIsFilterDialogOpen }: JournalHeaderProps) {
  return (
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
        
        <Button variant="outline" size="sm" onClick={() => setIsFilterDialogOpen(true)}>
          <Filter className="mr-2 h-4 w-4" />
          <span>Filtres</span>
        </Button>
        
        <Button size="sm" asChild>
          <Link to="/trade-entry">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Nouvelle entrée</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
