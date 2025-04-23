
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { FileUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';

interface ImportedTrade {
  date?: string;
  symbol?: string;
  type?: 'long' | 'short';
  entry_price?: number;
  exit_price?: number;
  size?: number;
  pnl?: number;
  fees?: number;
  stop_loss?: number;
  take_profit?: number;
  strategy?: string;
  notes?: string;
}

export function ImportTradesDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as ImportedTrade[];

      if (!jsonData.length) {
        throw new Error("Le fichier est vide");
      }

      const trades = jsonData.map((row: any) => ({
        user_id: user?.id,
        date: new Date(row.date).toISOString(),
        symbol: row.symbol || '',
        type: (row.type?.toLowerCase() === 'long' || row.type?.toLowerCase() === 'achat') ? 'long' : 'short',
        entry_price: parseFloat(row.entry_price || row.prix_entree || 0),
        exit_price: parseFloat(row.exit_price || row.prix_sortie || 0),
        size: parseFloat(row.size || row.taille || 0),
        pnl: parseFloat(row.pnl || row.profit_perte || 0),
        fees: parseFloat(row.fees || row.frais || 0) || null,
        stop_loss: parseFloat(row.stop_loss || 0) || null,
        take_profit: parseFloat(row.take_profit || 0) || null,
        strategy: row.strategy || row.strategie || null,
        notes: row.notes || row.commentaires || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('trades')
        .insert(trades);

      if (error) throw error;

      toast({
        title: "Import réussi",
        description: `${trades.length} trades ont été importés avec succès`,
      });
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: "Erreur d'import",
        description: "Une erreur est survenue lors de l'import des trades. Vérifiez le format de votre fichier.",
        variant: "destructive"
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
                 file.type === "application/vnd.ms-excel")) {
      processExcelFile(file);
    } else {
      toast({
        title: "Format non supporté",
        description: "Veuillez déposer un fichier Excel (.xlsx ou .xls)",
        variant: "destructive"
      });
    }
  }, [toast, processExcelFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processExcelFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importer des trades</DialogTitle>
          <DialogDescription>
            Glissez-déposez votre fichier Excel ou cliquez pour sélectionner
          </DialogDescription>
        </DialogHeader>
        
        <div
          className={`
            mt-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileSelect}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <FileUp className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragging ? 'Déposez votre fichier ici' : 'Cliquez ou glissez un fichier Excel'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Formats supportés : .xlsx, .xls
            </p>
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}
