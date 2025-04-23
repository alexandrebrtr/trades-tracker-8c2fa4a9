
import { Button } from "@/components/ui/button";
import { FileExport } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

export function ExportDataButton({ userId }: { userId: string }) {
  const { toast } = useToast();

  const exportToExcel = async () => {
    try {
      // Fetch user data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch user trades
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId);

      if (tradesError) throw tradesError;

      // Create worksheets
      const profileWorksheet = XLSX.utils.json_to_sheet([profileData]);
      const tradesWorksheet = XLSX.utils.json_to_sheet(tradesData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, profileWorksheet, "Profil");
      XLSX.utils.book_append_sheet(wb, tradesWorksheet, "Trades");

      // Generate Excel file
      XLSX.writeFile(wb, `donnees_utilisateur_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast({
        title: "Exportation réussie",
        description: "Vos données ont été exportées avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur est survenue lors de l'exportation de vos données",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={exportToExcel}
      variant="outline"
      className="w-full"
    >
      <FileExport className="mr-2" />
      Exporter mes données
    </Button>
  );
}
