import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { TradeData } from '@/services/TradeData';
import { useLanguage } from '@/context/LanguageContext';

// Define the ImportStats interface to fix the TypeScript errors
interface ImportStats {
  totalTrades: number;
  successfulImports: number;
  failedImports: number;
  errors: any[];
}

export function ImportTradesDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [csvData, setCsvData] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Now in the component:
  const [stats, setStats] = useState<ImportStats>({
    totalTrades: 0,
    successfulImports: 0,
    failedImports: 0,
    errors: []
  });

  const handleCsvDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvData(event.target.value);
  };

  const importTrades = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to import trades.",
      });
      return;
    }

    setIsImporting(true);
    setStats({ totalTrades: 0, successfulImports: 0, failedImports: 0, errors: [] });

    try {
      const results = await TradeData.importTradesFromCSV(user.id, csvData);

      setStats({
        totalTrades: results.totalTrades,
        successfulImports: results.successfulImports,
        failedImports: results.failedImports,
        errors: results.errors
      });

      toast({
        title: "Trades imported",
        description: `Successfully imported ${results.successfulImports} of ${results.totalTrades} trades.`,
      });
    } catch (error: any) {
      console.error("Import error:", error);
      toast({
        variant: "destructive",
        title: "Import error",
        description: error.message || "Failed to import trades.",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Importer depuis CSV</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Importer des trades depuis CSV</AlertDialogTitle>
          <AlertDialogDescription>
            Collez vos données CSV ici. Assurez-vous que les colonnes correspondent au format attendu:
            Date, Asset, Type, EntryPrice, ExitPrice, Size, P&L.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="csvData" className="text-right">
              CSV Data
            </Label>
            <Input
              id="csvData"
              value={csvData}
              onChange={handleCsvDataChange}
              className="col-span-3"
              as="textarea"
            />
          </div>
          {stats.errors.length > 0 && (
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-semibold">Import Errors</h3>
              <ul>
                {stats.errors.map((error, index) => (
                  <li key={index} className="mt-2">
                    <p className="font-medium">Error {index + 1}:</p>
                    <p className="text-sm">{error.message}</p>
                    {error.row && (
                      <p className="text-sm">Row: {JSON.stringify(error.row)}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction onClick={importTrades} disabled={isImporting}>
            {isImporting ? "Importing..." : "Importer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
