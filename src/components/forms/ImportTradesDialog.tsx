
import { useState, useRef, useEffect } from 'react';
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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { TradeData } from '@/services/TradeData';
import { useLanguage } from '@/context/LanguageContext';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";

// Define the ImportStats interface to fix the TypeScript errors
interface ImportStats {
  totalTrades: number;
  successfulImports: number;
  failedImports: number;
  errors: Array<{
    message: string;
    row?: any;
  }>;
}

interface ImportTradesDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ImportTradesDialog({ open, onOpenChange }: ImportTradesDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [csvData, setCsvData] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("csv");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Import stats tracking
  const [stats, setStats] = useState<ImportStats>({
    totalTrades: 0,
    successfulImports: 0,
    failedImports: 0,
    errors: []
  });

  const handleCsvDataChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvData(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
      let results;

      if (activeTab === "csv") {
        results = await TradeData.importTradesFromCSV(user.id, csvData);
      } else {
        // Process image import
        if (!imageFile) {
          throw new Error("No image selected");
        }
        results = await TradeData.importTradesFromImage(user.id, imageFile);
      }

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
      
      // Clear data after successful import
      if (activeTab === "csv") {
        setCsvData('');
      } else {
        setImageFile(null);
        setImagePreview(null);
      }
      
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

  // Use the controlled dialog if open/onOpenChange props are provided
  if (open !== undefined && onOpenChange) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          {renderDialogContent()}
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Otherwise, render with trigger button
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Importer depuis CSV</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        {renderDialogContent()}
      </AlertDialogContent>
    </AlertDialog>
  );

  function renderDialogContent() {
    return (
      <>
        <AlertDialogHeader>
          <AlertDialogTitle>Importer des trades</AlertDialogTitle>
          <AlertDialogDescription>
            Importez vos trades depuis un fichier CSV ou une capture d'écran de votre plateforme de trading.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>CSV</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>Image</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="csvData">Données CSV</Label>
                <Textarea
                  id="csvData"
                  value={csvData}
                  onChange={handleCsvDataChange}
                  className="min-h-[200px]"
                  placeholder="Date,Asset,Type,EntryPrice,ExitPrice,Size,P&L"
                />
                <p className="text-xs text-muted-foreground">
                  Format attendu: Date, Asset, Type, EntryPrice, ExitPrice, Size, P&L
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="mt-4">
            <div className="grid gap-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer" 
                   onClick={handleImageUploadClick}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                
                {imagePreview ? (
                  <div className="w-full">
                    <img 
                      src={imagePreview} 
                      alt="Trade screenshot" 
                      className="max-h-[300px] mx-auto object-contain rounded-md"
                    />
                    <p className="text-center mt-2 text-sm">Cliquez pour changer l'image</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mb-2 text-muted-foreground mx-auto" />
                    <p className="font-medium">Cliquez pour importer une image</p>
                    <p className="text-sm text-muted-foreground">
                      Importez une capture d'écran de votre plateforme de trading
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Plateformes supportées: MT4, MT5, Binance, FTX, Coinbase Pro
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {stats.errors.length > 0 && (
          <div className="rounded-md border p-4 mt-4">
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

        <AlertDialogFooter>
          <AlertDialogCancel>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction onClick={importTrades} disabled={isImporting}>
            {isImporting ? "Importing..." : "Importer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </>
    );
  }
}
