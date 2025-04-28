
import { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { FileUp, FileDown, AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";

interface ImportedTrade {
  date?: string | Date;
  symbol?: string;
  type?: 'long' | 'short';
  entry_price?: number;
  exit_price?: number;
  size?: number;
  pnl?: number;
  fees?: number;
  stop_loss?: number | null;
  take_profit?: number | null;
  strategy?: string | null;
  notes?: string | null;
}

interface MappedField {
  sourceField: string;
  targetField: string;
}

interface ImportStats {
  total: number;
  valid: number;
  invalid: number;
  profit: number;
  loss: number;
}

export function ImportTradesDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'importing'>('upload');
  const [rawData, setRawData] = useState<any[]>([]);
  const [mappedData, setMappedData] = useState<ImportedTrade[]>([]);
  const [fieldMappings, setFieldMappings] = useState<MappedField[]>([]);
  const [availableSourceFields, setAvailableSourceFields] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});
  const [progress, setProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default');
  const [stats, setStats] = useState<ImportStats>({
    total: 0,
    valid: 0,
    invalid: 0,
    profit: 0,
    loss: 0
  });

  // Templates for common export formats
  const templates = {
    default: [
      { sourceField: 'date', targetField: 'date' },
      { sourceField: 'symbol', targetField: 'symbol' },
      { sourceField: 'type', targetField: 'type' },
      { sourceField: 'entry_price', targetField: 'entry_price' },
      { sourceField: 'exit_price', targetField: 'exit_price' },
      { sourceField: 'size', targetField: 'size' },
      { sourceField: 'pnl', targetField: 'pnl' },
      { sourceField: 'fees', targetField: 'fees' },
      { sourceField: 'stop_loss', targetField: 'stop_loss' },
      { sourceField: 'take_profit', targetField: 'take_profit' },
      { sourceField: 'strategy', targetField: 'strategy' },
      { sourceField: 'notes', targetField: 'notes' },
    ],
    metatrader: [
      { sourceField: 'Time', targetField: 'date' },
      { sourceField: 'Symbol', targetField: 'symbol' },
      { sourceField: 'Type', targetField: 'type' },
      { sourceField: 'Price', targetField: 'entry_price' },
      { sourceField: 'Price.1', targetField: 'exit_price' },
      { sourceField: 'Volume', targetField: 'size' },
      { sourceField: 'Profit', targetField: 'pnl' },
      { sourceField: 'Commission', targetField: 'fees' },
      { sourceField: 'S/L', targetField: 'stop_loss' },
      { sourceField: 'T/P', targetField: 'take_profit' },
      { sourceField: 'Comment', targetField: 'notes' },
    ],
    tradingview: [
      { sourceField: 'Date', targetField: 'date' },
      { sourceField: 'Ticker', targetField: 'symbol' },
      { sourceField: 'Side', targetField: 'type' },
      { sourceField: 'Entry Price', targetField: 'entry_price' },
      { sourceField: 'Exit Price', targetField: 'exit_price' },
      { sourceField: 'Amount', targetField: 'size' },
      { sourceField: 'P&L', targetField: 'pnl' },
      { sourceField: 'Commission', targetField: 'fees' },
      { sourceField: 'Stop Loss', targetField: 'stop_loss' },
      { sourceField: 'Take Profit', targetField: 'take_profit' },
      { sourceField: 'Strategy', targetField: 'strategy' },
      { sourceField: 'Notes', targetField: 'notes' },
    ],
    french: [
      { sourceField: 'date', targetField: 'date' },
      { sourceField: 'symbole', targetField: 'symbol' },
      { sourceField: 'type', targetField: 'type' },
      { sourceField: 'prix_entree', targetField: 'entry_price' },
      { sourceField: 'prix_sortie', targetField: 'exit_price' },
      { sourceField: 'taille', targetField: 'size' },
      { sourceField: 'profit_perte', targetField: 'pnl' },
      { sourceField: 'frais', targetField: 'fees' },
      { sourceField: 'stop_loss', targetField: 'stop_loss' },
      { sourceField: 'take_profit', targetField: 'take_profit' },
      { sourceField: 'strategie', targetField: 'strategy' },
      { sourceField: 'commentaires', targetField: 'notes' },
    ],
  };

  // Target fields with their display names and validation requirements
  const targetFields = [
    { field: 'date', display: 'Date', required: true },
    { field: 'symbol', display: 'Symbole', required: true },
    { field: 'type', display: 'Type', required: true },
    { field: 'entry_price', display: "Prix d'entrée", required: true },
    { field: 'exit_price', display: 'Prix de sortie', required: true },
    { field: 'size', display: 'Taille', required: true },
    { field: 'pnl', display: 'P&L', required: false },
    { field: 'fees', display: 'Frais', required: false },
    { field: 'stop_loss', display: 'Stop Loss', required: false },
    { field: 'take_profit', display: 'Take Profit', required: false },
    { field: 'strategy', display: 'Stratégie', required: false },
    { field: 'notes', display: 'Notes', required: false },
  ];

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setStep('upload');
      setRawData([]);
      setMappedData([]);
      setFieldMappings([]);
      setAvailableSourceFields([]);
      setValidationErrors({});
      setProgress(0);
      setSelectedTemplate('default');
    }
  }, [open]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const autoDetectTemplate = (headers: string[]) => {
    // Convert headers to lowercase for case-insensitive matching
    const lowerHeaders = headers.map(h => h.toLowerCase());
    
    // Check for each template how many fields match
    const matchCounts = Object.entries(templates).map(([templateName, mappings]) => {
      const matches = mappings.filter(mapping => 
        lowerHeaders.includes(mapping.sourceField.toLowerCase())
      ).length;
      return { templateName, matches };
    });
    
    // Find the template with the most matches
    const bestMatch = matchCounts.reduce((best, current) => 
      current.matches > best.matches ? current : best, 
      { templateName: 'default', matches: 0 }
    );
    
    // If the best match has at least 3 matches, use that template
    if (bestMatch.matches >= 3) {
      setSelectedTemplate(bestMatch.templateName);
      return bestMatch.templateName;
    }
    
    return 'default'; // Default to standard template if no good match
  };

  const processExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (!jsonData.length) {
        throw new Error("Le fichier est vide");
      }

      setRawData(jsonData);
      
      // Extract headers/fields from the first row
      const fields = Object.keys(jsonData[0]);
      setAvailableSourceFields(fields);
      
      // Auto-detect template and apply mappings
      const detectedTemplate = autoDetectTemplate(fields);
      const initialMappings = templates[detectedTemplate as keyof typeof templates].filter(
        mapping => fields.includes(mapping.sourceField)
      );
      
      setFieldMappings(initialMappings);
      
      // Move to mapping step
      setStep('map');

    } catch (error: any) {
      console.error('Erreur lors de la lecture du fichier:', error);
      toast({
        title: "Erreur de lecture",
        description: "Le fichier Excel n'a pas pu être lu correctement. Vérifiez son format.",
        variant: "destructive"
      });
    }
  };

  const validateTrade = (trade: ImportedTrade, index: number): string[] => {
    const errors: string[] = [];
    
    // Required field validation
    if (!trade.date) errors.push("Date manquante");
    if (!trade.symbol) errors.push("Symbole manquant");
    if (!trade.type) errors.push("Type de trade manquant");
    if (trade.entry_price === undefined) errors.push("Prix d'entrée manquant");
    if (trade.exit_price === undefined) errors.push("Prix de sortie manquant");
    if (trade.size === undefined) errors.push("Taille manquante");
    
    // Type validation
    if (trade.date && !(trade.date instanceof Date) && isNaN(Date.parse(trade.date.toString()))) {
      errors.push("Format de date invalide");
    }
    
    if (trade.type && !['long', 'short', 'achat', 'vente'].includes(trade.type.toString().toLowerCase())) {
      errors.push("Type de trade invalide (doit être 'long' ou 'short')");
    }
    
    // Numeric validation
    if (trade.entry_price !== undefined && isNaN(Number(trade.entry_price))) {
      errors.push("Prix d'entrée doit être un nombre");
    }
    
    if (trade.exit_price !== undefined && isNaN(Number(trade.exit_price))) {
      errors.push("Prix de sortie doit être un nombre");
    }
    
    if (trade.size !== undefined && isNaN(Number(trade.size))) {
      errors.push("Taille doit être un nombre");
    }
    
    return errors;
  };

  const prepareTradesData = () => {
    if (!rawData.length) return [];
    
    const mappedTrades: ImportedTrade[] = [];
    const errors: Record<number, string[]> = {};
    let validCount = 0;
    let invalidCount = 0;
    let profitSum = 0;
    let lossSum = 0;
    
    rawData.forEach((row, index) => {
      const trade: ImportedTrade = {};
      
      // Apply mappings to create a trade object
      fieldMappings.forEach(mapping => {
        const value = row[mapping.sourceField];
        if (value !== undefined) {
          // Type conversions and normalization
          if (mapping.targetField === 'date') {
            // Try to parse the date value
            try {
              const dateValue = value instanceof Date 
                ? value 
                : new Date(value);
              trade.date = dateValue;
            } catch (e) {
              trade.date = value;
            }
          } else if (mapping.targetField === 'type') {
            // Normalize type values
            const typeValue = value.toString().toLowerCase();
            trade.type = ['long', 'achat', 'buy'].includes(typeValue) ? 'long' : 'short';
          } else if (['entry_price', 'exit_price', 'size', 'pnl', 'fees', 'stop_loss', 'take_profit'].includes(mapping.targetField)) {
            // Parse numeric values
            trade[mapping.targetField as keyof ImportedTrade] = parseFloat(value);
          } else {
            // For strings and other types
            trade[mapping.targetField as keyof ImportedTrade] = value;
          }
        }
      });
      
      // Calculate PNL if not provided
      if (trade.entry_price !== undefined && trade.exit_price !== undefined && trade.size !== undefined && trade.pnl === undefined) {
        const entryValue = trade.entry_price * trade.size;
        const exitValue = trade.exit_price * trade.size;
        
        if (trade.type === 'long') {
          trade.pnl = exitValue - entryValue;
        } else {
          trade.pnl = entryValue - exitValue;
        }
        
        // Subtract fees if present
        if (trade.fees) {
          trade.pnl -= trade.fees;
        }
        
        // Round to 2 decimal places
        trade.pnl = Math.round(trade.pnl * 100) / 100;
      }
      
      // Validate the trade
      const tradeErrors = validateTrade(trade, index);
      
      if (tradeErrors.length) {
        errors[index] = tradeErrors;
        invalidCount++;
      } else {
        validCount++;
        
        // Collect stats
        if (trade.pnl !== undefined) {
          if (trade.pnl > 0) {
            profitSum += trade.pnl;
          } else {
            lossSum += Math.abs(trade.pnl || 0);
          }
        }
      }
      
      mappedTrades.push(trade);
    });
    
    setValidationErrors(errors);
    setStats({
      total: mappedTrades.length,
      valid: validCount,
      invalid: invalidCount,
      profit: profitSum,
      loss: lossSum
    });
    
    return mappedTrades;
  };

  const applyMapping = () => {
    const trades = prepareTradesData();
    setMappedData(trades);
    setStep('preview');
  };

  const updateMapping = (index: number, targetField: string) => {
    const newMappings = [...fieldMappings];
    newMappings[index] = { ...newMappings[index], targetField };
    setFieldMappings(newMappings);
  };

  const applyTemplate = (templateName: string) => {
    const template = templates[templateName as keyof typeof templates];
    const newMappings = template.filter(
      mapping => availableSourceFields.includes(mapping.sourceField)
    );
    setFieldMappings(newMappings);
    setSelectedTemplate(templateName);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processExcelFile(file);
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
  }, [toast]);

  const importTrades = async () => {
    if (!user || !mappedData.length) return;
    
    setStep('importing');
    setProgress(0);
    
    try {
      const validTrades = mappedData.filter((_, index) => !validationErrors[index]);
      const totalCount = validTrades.length;
      
      // Process in batches of 50
      const batchSize = 50;
      let processed = 0;
      
      for (let i = 0; i < validTrades.length; i += batchSize) {
        const batch = validTrades.slice(i, i + batchSize);
        
        const trades = batch.map(trade => {
          // Safely handle date conversion to ensure we always pass a string to the database
          const dateString = trade.date instanceof Date
            ? trade.date.toISOString()
            : typeof trade.date === 'string'
              ? new Date(trade.date).toISOString()
              : new Date().toISOString();

          return {
            user_id: user.id,
            date: dateString,
            symbol: trade.symbol || '',
            type: (trade.type?.toString().toLowerCase() === 'long' || 
                  trade.type?.toString().toLowerCase() === 'achat') ? 'long' : 'short',
            entry_price: parseFloat(trade.entry_price?.toString() || '0'),
            exit_price: parseFloat(trade.exit_price?.toString() || '0'),
            size: parseFloat(trade.size?.toString() || '0'),
            pnl: parseFloat(trade.pnl?.toString() || '0'),
            fees: trade.fees !== undefined ? parseFloat(trade.fees.toString()) : null,
            stop_loss: trade.stop_loss !== undefined ? parseFloat(trade.stop_loss.toString()) : null,
            take_profit: trade.take_profit !== undefined ? parseFloat(trade.take_profit.toString()) : null,
            strategy: trade.strategy || null,
            notes: trade.notes || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        });

        const { error } = await supabase
          .from('trades')
          .insert(trades);

        if (error) throw error;
        
        processed += batch.length;
        setProgress(Math.round((processed / totalCount) * 100));
      }

      toast({
        title: "Import réussi",
        description: `${validTrades.length} trades ont été importés avec succès`,
      });
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: "Erreur d'import",
        description: "Une erreur est survenue lors de l'import des trades.",
        variant: "destructive"
      });
      setStep('preview'); // Return to preview to let the user try again
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'upload':
        return (
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
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p className="font-semibold mb-1">Téléchargez un modèle pour commencer :</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.preventDefault();
                    // Generate a sample Excel file for download
                    const ws = XLSX.utils.json_to_sheet([
                      {
                        date: "2023-01-01",
                        symbol: "BTCUSD",
                        type: "long",
                        entry_price: 30000,
                        exit_price: 32000,
                        size: 1,
                        pnl: 2000,
                        fees: 10,
                        stop_loss: 29000,
                        take_profit: 33000,
                        strategy: "Breakout",
                        notes: "Good trade following the trend"
                      }
                    ]);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Trades");
                    XLSX.writeFile(wb, "modele_trades.xlsx");
                  }}
                >
                  <FileDown className="h-4 w-4 mr-2" /> Modèle Excel
                </Button>
              </div>
            </label>
          </div>
        );
        
      case 'map':
        return (
          <div className="mt-4 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Configuration des colonnes</h3>
              <Select value={selectedTemplate} onValueChange={applyTemplate}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sélectionner un template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Template standard</SelectItem>
                  <SelectItem value="metatrader">MetaTrader</SelectItem>
                  <SelectItem value="tradingview">TradingView</SelectItem>
                  <SelectItem value="french">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Alert className="bg-muted">
              <AlertDescription className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4" />
                <span>
                  Associez chaque colonne de votre fichier Excel à un champ correspondant.
                </span>
              </AlertDescription>
            </Alert>
            
            <div className="overflow-auto max-h-[300px] border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Colonne Excel</TableHead>
                    <TableHead className="w-1/3">Champ cible</TableHead>
                    <TableHead className="w-1/3">Exemple de valeur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fieldMappings.map((mapping, index) => (
                    <TableRow key={index}>
                      <TableCell>{mapping.sourceField}</TableCell>
                      <TableCell>
                        <Select 
                          value={mapping.targetField}
                          onValueChange={(value) => updateMapping(index, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un champ" />
                          </SelectTrigger>
                          <SelectContent>
                            {targetFields.map(field => (
                              <SelectItem key={field.field} value={field.field}>
                                {field.display} {field.required && '*'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm truncate">
                        {rawData[0][mapping.sourceField]?.toString() || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="text-muted-foreground text-xs mt-2">
              * Champs obligatoires
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Retour
              </Button>
              <Button onClick={applyMapping}>
                Prévisualiser les données
              </Button>
            </DialogFooter>
          </div>
        );
        
      case 'preview':
        return (
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 bg-muted/30 rounded-lg p-4">
                <p className="font-semibold text-sm">Total des trades</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="space-y-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg p-4">
                <p className="font-semibold text-sm">Valides</p>
                <p className="text-2xl font-bold">{stats.valid}</p>
              </div>
              <div className="space-y-2 bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg p-4">
                <p className="font-semibold text-sm">Avec erreurs</p>
                <p className="text-2xl font-bold">{stats.invalid}</p>
              </div>
            </div>
            
            <Tabs defaultValue="valid">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="valid">Trades valides ({stats.valid})</TabsTrigger>
                <TabsTrigger value="invalid">Trades avec erreurs ({stats.invalid})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="valid" className="space-y-4 pt-2">
                <div className="overflow-auto max-h-[300px] border rounded">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Symbole</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>P. entrée</TableHead>
                        <TableHead>P. sortie</TableHead>
                        <TableHead>Taille</TableHead>
                        <TableHead>P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mappedData.filter((_, i) => !validationErrors[i]).map((trade, index) => {
                        // Safely convert date to string for formatting
                        let formattedDate = 'N/A';
                        if (trade.date instanceof Date) {
                          formattedDate = formatDate(trade.date.toISOString());
                        } else if (typeof trade.date === 'string') {
                          try {
                            formattedDate = formatDate(trade.date);
                          } catch (e) {
                            formattedDate = trade.date;
                          }
                        }
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{formattedDate}</TableCell>
                            <TableCell>{trade.symbol}</TableCell>
                            <TableCell>
                              <Badge variant={trade.type === 'long' ? 'success' : 'destructive'}>
                                {trade.type === 'long' ? 'Long' : 'Short'}
                              </Badge>
                            </TableCell>
                            <TableCell>{trade.entry_price}</TableCell>
                            <TableCell>{trade.exit_price}</TableCell>
                            <TableCell>{trade.size}</TableCell>
                            <TableCell className={trade.pnl && trade.pnl > 0 ? 'text-green-600' : 'text-red-600'}>
                              {trade.pnl !== undefined && (trade.pnl > 0 ? '+' : '')}{trade.pnl}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="invalid" className="space-y-4 pt-2">
                <div className="overflow-auto max-h-[300px] border rounded">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ligne</TableHead>
                        <TableHead>Symbole</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Erreurs</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(validationErrors).map(([index, errors]) => {
                        const rowIndex = parseInt(index);
                        const trade = mappedData[rowIndex];
                        
                        // Safely convert date to string for formatting
                        let formattedDate = 'N/A';
                        if (trade?.date instanceof Date) {
                          formattedDate = formatDate(trade.date.toISOString());
                        } else if (typeof trade?.date === 'string') {
                          try {
                            formattedDate = formatDate(trade.date);
                          } catch (e) {
                            formattedDate = trade.date;
                          }
                        }
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{rowIndex + 1}</TableCell>
                            <TableCell>{trade?.symbol || 'N/A'}</TableCell>
                            <TableCell>{formattedDate}</TableCell>
                            <TableCell>
                              <ul className="list-disc ml-4 text-xs">
                                {errors.map((error, i) => (
                                  <li key={i} className="text-red-500">{error}</li>
                                ))}
                              </ul>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
            
            <Alert className={stats.invalid > 0 ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' : 'bg-green-500/10 text-green-700 dark:text-green-400'}>
              <AlertDescription className="flex items-center space-x-2">
                {stats.invalid > 0 ? (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {stats.invalid} trades contiennent des erreurs et ne seront pas importés.
                      {stats.valid > 0 && ` ${stats.valid} trades valides seront importés.`}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Tous les trades sont valides et prêts à être importés.</span>
                  </>
                )}
              </AlertDescription>
            </Alert>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('map')}>
                Retour
              </Button>
              <Button 
                onClick={importTrades}
                disabled={stats.valid === 0}
              >
                Importer {stats.valid} trades
              </Button>
            </DialogFooter>
          </div>
        );
        
      case 'importing':
        return (
          <div className="mt-4 space-y-6 text-center py-8">
            <h3 className="text-lg font-semibold mb-4">Importation en cours...</h3>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground">
              {progress}% complété
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Importer des trades</DialogTitle>
          <DialogDescription>
            {step === 'upload' && "Glissez-déposez votre fichier Excel ou cliquez pour sélectionner"}
            {step === 'map' && "Configurez la correspondance entre les colonnes Excel et les champs du trade"}
            {step === 'preview' && "Vérifiez vos données avant l'import final"}
            {step === 'importing' && "Importation en cours, veuillez patienter..."}
          </DialogDescription>
        </DialogHeader>
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
