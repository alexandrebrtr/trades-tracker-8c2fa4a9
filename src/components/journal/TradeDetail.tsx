import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowDown, ArrowUp, Calendar, DollarSign, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trade } from "./types"; // Import the Trade interface from types.ts

interface TradeDetailProps {
  trade: Trade;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export function TradeDetail({ trade, onClose, onDelete }: TradeDetailProps) {
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

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {trade.symbol}
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
                    <span className="font-medium">{trade.strategy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taille:</span>
                    <span className="font-medium">{trade.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais:</span>
                    <span className="font-medium">{trade.fees} €</span>
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
                    <span className="font-medium">{trade.entry_price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <ArrowDown className="h-4 w-4" />
                      Prix de sortie:
                    </span>
                    <span className="font-medium">{trade.exit_price}</span>
                  </div>
                </div>
              </div>

              {trade.notes && (
                <div>
                  <h3 className="text-lg font-semibold">Notes</h3>
                  <div className="mt-2 p-3 bg-muted rounded-lg whitespace-pre-line">
                    {trade.notes}
                  </div>
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
