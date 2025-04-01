
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowDown, ArrowUp, Calendar, DollarSign, Trash2, Edit, Flag, Target, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trade } from "./types";

interface TradeDetailProps {
  trade: Trade;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onUpdate?: (trade: Trade) => void;
}

export function TradeDetail({ trade: initialTrade, onClose, onDelete, onUpdate }: TradeDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [trade, setTrade] = useState<Trade>(initialTrade);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: fr,
      });
    } catch (error) {
      return "Date inconnue";
    }
  };

  const calculatePercentageChange = () => {
    if (trade.type === "long") {
      return ((trade.exit_price - trade.entry_price) / trade.entry_price) * 100;
    } else {
      return ((trade.entry_price - trade.exit_price) / trade.entry_price) * 100;
    }
  };

  const percentageChange = calculatePercentageChange();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Pour les champs numériques
    if (["entry_price", "exit_price", "size", "fees", "stop_loss", "take_profit"].includes(name)) {
      let numValue = parseFloat(value);
      if (isNaN(numValue)) numValue = 0;
      
      setTrade(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setTrade(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    if (!trade.entry_price || !trade.exit_price || !trade.size) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Recalculer le P&L
      let pnl;
      if (trade.type === "long") {
        pnl = (trade.exit_price - trade.entry_price) * trade.size - (trade.fees || 0);
      } else {
        pnl = (trade.entry_price - trade.exit_price) * trade.size - (trade.fees || 0);
      }
      
      const updatedTrade = {
        ...trade,
        pnl,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from("trades")
        .update(updatedTrade)
        .eq("id", trade.id);
      
      if (error) throw error;
      
      setTrade(updatedTrade);
      if (onUpdate) onUpdate(updatedTrade);
      
      toast({
        title: "Trade mis à jour",
        description: "Les modifications ont été enregistrées avec succès."
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du trade:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du trade.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {isEditing ? (
              <Input 
                name="symbol" 
                value={trade.symbol} 
                onChange={handleInputChange} 
                className="font-bold text-2xl h-10 max-w-48"
              />
            ) : (
              trade.symbol
            )}
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                trade.type === "long"
                  ? "bg-profit/10 text-profit"
                  : "bg-loss/10 text-loss"
              )}
            >
              {trade.type === "long" ? "LONG" : "SHORT"}
            </span>
          </h2>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:bg-muted"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Annuler
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-profit text-white hover:bg-profit/90"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>Sauvegarde...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary hover:bg-primary/10"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-loss hover:bg-loss/10"
                    onClick={() => onDelete(trade.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={onClose}>
                  Fermer
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Détails du trade</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{formatDate(trade.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stratégie:</span>
                    {isEditing ? (
                      <Input 
                        name="strategy" 
                        value={trade.strategy || ''} 
                        onChange={handleInputChange} 
                        className="w-[180px]"
                      />
                    ) : (
                      <span className="font-medium">{trade.strategy}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taille:</span>
                    {isEditing ? (
                      <Input 
                        name="size" 
                        type="number"
                        step="0.00001"
                        value={trade.size} 
                        onChange={handleInputChange} 
                        className="w-[180px]"
                      />
                    ) : (
                      <span className="font-medium">{trade.size}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais:</span>
                    {isEditing ? (
                      <Input 
                        name="fees" 
                        type="number"
                        step="0.00001"
                        value={trade.fees || 0} 
                        onChange={handleInputChange} 
                        className="w-[180px]"
                      />
                    ) : (
                      <span className="font-medium">{trade.fees} €</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Résultat</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">P&L:</span>
                    <span
                      className={cn(
                        "font-bold",
                        trade.pnl >= 0 ? "text-profit" : "text-loss"
                      )}
                    >
                      {trade.pnl >= 0 ? "+" : ""}
                      {trade.pnl?.toFixed(5)} €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Variation en pourcentage:
                    </span>
                    <span
                      className={cn(
                        "font-bold",
                        percentageChange >= 0 ? "text-profit" : "text-loss"
                      )}
                    >
                      {percentageChange >= 0 ? "+" : ""}
                      {percentageChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Prix</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <ArrowUp className="h-4 w-4" />
                      Prix d'entrée:
                    </span>
                    {isEditing ? (
                      <Input 
                        name="entry_price" 
                        type="number"
                        step="0.00001"
                        value={trade.entry_price} 
                        onChange={handleInputChange} 
                        className="w-[180px]"
                      />
                    ) : (
                      <span className="font-medium">{trade.entry_price}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <ArrowDown className="h-4 w-4" />
                      Prix de sortie:
                    </span>
                    {isEditing ? (
                      <Input 
                        name="exit_price" 
                        type="number"
                        step="0.00001"
                        value={trade.exit_price} 
                        onChange={handleInputChange} 
                        className="w-[180px]"
                      />
                    ) : (
                      <span className="font-medium">{trade.exit_price}</span>
                    )}
                  </div>
                  
                  {/* Stop Loss */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Flag className="h-4 w-4" />
                      Stop Loss:
                    </span>
                    {isEditing ? (
                      <Input 
                        name="stop_loss" 
                        type="number"
                        step="0.00001"
                        value={trade.stop_loss || ''} 
                        onChange={handleInputChange} 
                        className="w-[180px]"
                        placeholder="Non défini"
                      />
                    ) : (
                      <span className="font-medium">{trade.stop_loss || 'Non défini'}</span>
                    )}
                  </div>
                  
                  {/* Take Profit */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      Take Profit:
                    </span>
                    {isEditing ? (
                      <Input 
                        name="take_profit" 
                        type="number"
                        step="0.00001"
                        value={trade.take_profit || ''} 
                        onChange={handleInputChange} 
                        className="w-[180px]"
                        placeholder="Non défini"
                      />
                    ) : (
                      <span className="font-medium">{trade.take_profit || 'Non défini'}</span>
                    )}
                  </div>
                </div>
              </div>

              {(isEditing || trade.notes) && (
                <div>
                  <h3 className="text-lg font-semibold">Notes</h3>
                  {isEditing ? (
                    <Textarea
                      name="notes"
                      value={trade.notes || ''}
                      onChange={handleInputChange}
                      className="mt-2"
                      rows={4}
                    />
                  ) : (
                    <div className="mt-2 p-3 bg-muted rounded-lg whitespace-pre-line">
                      {trade.notes}
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-muted-foreground mt-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Créé {formatTimeAgo(trade.created_at)}
                </div>
                {trade.updated_at !== trade.created_at && (
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    Modifié {formatTimeAgo(trade.updated_at)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
