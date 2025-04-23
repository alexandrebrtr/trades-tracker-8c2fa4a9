
import { format, subDays, subMonths, subYears } from "date-fns";

export function formatDate(date: Date): string {
  return format(date, "dd/MM/yyyy");
}

export function formatDateTime(date: Date): string {
  return format(date, "dd/MM/yyyy HH:mm");
}

export function getStartDateFromTimeframe(timeframe: string): Date {
  const now = new Date();
  
  switch (timeframe) {
    case "week":
    case "7d":
      return subDays(now, 7);
    case "month":
      return subMonths(now, 1);
    case "quarter":
    case "3m":
      return subMonths(now, 3);
    case "6m":
      return subMonths(now, 6);
    case "year":
    case "1y":
      return subYears(now, 1);
    case "all":
    default:
      return new Date(2000, 0, 1); // A date in the past to get all data
  }
}

export function getTimeframePeriodLabel(timeframe: string): string {
  switch (timeframe) {
    case "7d":
    case "week":
      return "7 derniers jours";
    case "month":
      return "30 derniers jours";
    case "quarter":
    case "3m":
      return "3 derniers mois";
    case "6m":
      return "6 derniers mois";
    case "year":
    case "1y":
      return "12 derniers mois";
    case "all":
    default:
      return "Tout l'historique";
  }
}
