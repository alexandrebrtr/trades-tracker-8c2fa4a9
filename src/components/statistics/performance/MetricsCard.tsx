
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign, TrendingUp, Activity, Percent } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

interface MetricsCardProps {
  title: string;
  value: number | string;
  type: "currency" | "percentage" | "number" | "text";
  icon: "profit" | "performance" | "volatility" | "ratio";
  trend?: "up" | "down" | "neutral";
  comparison?: string;
}

export const MetricsCard = ({ 
  title, 
  value, 
  type, 
  icon, 
  trend, 
  comparison 
}: MetricsCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case "profit":
        return <BadgeDollarSign className="h-5 w-5" />;
      case "performance":
        return <TrendingUp className="h-5 w-5" />;
      case "volatility":
        return <Activity className="h-5 w-5" />;
      case "ratio":
        return <Percent className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const formatValue = () => {
    if (typeof value === "string") return value;
    
    switch (type) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return formatPercentage(value);
      case "number":
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };

  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    return trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500";
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={`p-2 rounded-full ${icon === "profit" ? "bg-green-100" : icon === "performance" ? "bg-blue-100" : icon === "volatility" ? "bg-red-100" : "bg-purple-100"}`}>
            {getIcon()}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold">{formatValue()}</p>
          {comparison && (
            <p className={`text-xs ${getTrendColor()}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {comparison}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
