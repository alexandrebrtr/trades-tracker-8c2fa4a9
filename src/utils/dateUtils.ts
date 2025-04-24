
import { format, subDays, subMonths, subYears } from "date-fns";
import { fr } from "date-fns/locale";

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
    case "1m":  
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
      return new Date(2000, 0, 1); // Une date dans le passé pour récupérer toutes les données
  }
}

export function getTimeframePeriodLabel(timeframe: string): string {
  switch (timeframe) {
    case "7d":
    case "week":
      return "7 derniers jours";
    case "month":
    case "1m":
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

export function formatDateWithLocale(date: Date, formatStr: string = "PPP"): string {
  return format(date, formatStr, { locale: fr });
}

export function getDaysInRange(startDate: Date, endDate: Date = new Date()): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getPeriodStartDate(period: "today" | "yesterday" | "week" | "month" | "year" | "all" = "all"): Date {
  const now = new Date();
  
  switch (period) {
    case "today":
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    
    case "yesterday":
      const yesterday = subDays(now, 1);
      yesterday.setHours(0, 0, 0, 0);
      return yesterday;
    
    case "week":
      return subDays(now, 7);
    
    case "month":
      return subMonths(now, 1);
    
    case "year":
      return subYears(now, 1);
    
    case "all":
    default:
      return new Date(2000, 0, 1);
  }
}

export function groupDatesByPeriod(dates: Date[], period: "day" | "week" | "month" | "year"): Record<string, Date[]> {
  const grouped: Record<string, Date[]> = {};
  
  dates.forEach(date => {
    let key: string;
    
    switch (period) {
      case "day":
        key = format(date, "yyyy-MM-dd");
        break;
      
      case "week":
        // Get the start of the week (Monday) for the given date
        const day = date.getDay();
        const diff = (day === 0 ? 6 : day - 1); // adjust for Sunday
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - diff);
        key = format(startOfWeek, "yyyy-'W'ww");
        break;
      
      case "month":
        key = format(date, "yyyy-MM");
        break;
      
      case "year":
        key = format(date, "yyyy");
        break;
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(date);
  });
  
  return grouped;
}

export function getMonthRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
}

export function getRelativeDateString(date: Date): string {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "Aujourd'hui";
  } else if (diffInDays === 1) {
    return "Hier";
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays} jours`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `Il y a ${months} mois`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `Il y a ${years} an${years > 1 ? 's' : ''}`;
  }
}
