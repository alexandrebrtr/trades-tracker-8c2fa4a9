
import { Trade } from '@/components/journal/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JournalEntryCardProps {
  entry: Trade;
  onClick: () => void;
  onDelete: (event: React.MouseEvent) => void;
}

export function JournalEntryCard({ entry, onClick, onDelete }: JournalEntryCardProps) {
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
