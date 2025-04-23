
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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

      // Fetch user trades with all details
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select(`
          id,
          date,
          symbol,
          type,
          entry_price,
          exit_price,
          size,
          pnl,
          fees,
          stop_loss,
          take_profit,
          strategy,
          notes,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (tradesError) throw tradesError;

      // Format trades data for better readability
      const formattedTrades = tradesData.map(trade => ({
        Date: new Date(trade.date).toLocaleDateString('fr-FR'),
        Symbole: trade.symbol,
        Type: trade.type === 'long' ? 'Long' : 'Short',
        "Prix d'entrée": trade.entry_price,
        "Prix de sortie": trade.exit_price,
        "Taille de position": trade.size,
        "P&L": trade.pnl,
        "Frais": trade.fees || 0,
        "Stop Loss": trade.stop_loss || 'Non défini',
        "Take Profit": trade.take_profit || 'Non défini',
        "Stratégie": trade.strategy || 'Non définie',
        "Notes": trade.notes || '',
        "Créé le": new Date(trade.created_at).toLocaleDateString('fr-FR'),
        "Mis à jour le": new Date(trade.updated_at).toLocaleDateString('fr-FR')
      }));

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Add profile sheet
      const profileWorksheet = XLSX.utils.json_to_sheet([{
        "Nom d'utilisateur": profileData.username || 'Non défini',
        "Email": profileData.email || 'Non défini',
        "Balance": profileData.balance || 0,
        "Premium": profileData.premium ? 'Oui' : 'Non',
        "Premium depuis": profileData.premium_since ? new Date(profileData.premium_since).toLocaleDateString('fr-FR') : 'Non applicable',
        "Premium expire le": profileData.premium_expires ? new Date(profileData.premium_expires).toLocaleDateString('fr-FR') : 'Non applicable',
        "Téléphone": profileData.phone || 'Non défini',
        "Adresse": profileData.address || 'Non définie',
        "Bio": profileData.bio || 'Non définie',
        "Compte créé le": new Date(profileData.created_at).toLocaleDateString('fr-FR'),
        "Dernière mise à jour": new Date(profileData.updated_at).toLocaleDateString('fr-FR')
      }]);

      // Add trades sheet with all details
      const tradesWorksheet = XLSX.utils.json_to_sheet(formattedTrades);

      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(wb, profileWorksheet, "Profil");
      XLSX.utils.book_append_sheet(wb, tradesWorksheet, "Trades");

      // Generate Excel file
      XLSX.writeFile(wb, `donnees_utilisateur_${new Date().toLocaleDateString('fr-FR')}.xlsx`);

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
      <FileText className="mr-2" />
      Exporter mes données
    </Button>
  );
}
