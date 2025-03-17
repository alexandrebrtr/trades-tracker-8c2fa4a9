
// Configuration des couleurs pour les graphiques
export const CHART_CONFIG = {
  primary: {
    theme: {
      light: "#9b87f5",
      dark: "#9b87f5",
    },
    label: "Performance"
  },
  secondary: {
    theme: {
      light: "#34d399",
      dark: "#34d399",
    },
    label: "Volatilité"
  },
  tertiary: {
    theme: {
      light: "#f97316",
      dark: "#f97316",
    },
    label: "Marché"
  },
  danger: {
    theme: {
      light: "#ef4444",
      dark: "#ef4444",
    },
    label: "Risque"
  },
};

// Données de démonstration
export const PERFORMANCE_DATA = [
  { date: "Jan", value: 1200, benchmark: 1000 },
  { date: "Fev", value: 1800, benchmark: 1200 },
  { date: "Mar", value: 1600, benchmark: 1300 },
  { date: "Avr", value: 2200, benchmark: 1400 },
  { date: "Mai", value: 1900, benchmark: 1500 },
  { date: "Jun", value: 2400, benchmark: 1600 },
  { date: "Jul", value: 2800, benchmark: 1700 },
  { date: "Aou", value: 3200, benchmark: 1800 },
  { date: "Sep", value: 3600, benchmark: 1900 },
  { date: "Oct", value: 3300, benchmark: 2000 },
  { date: "Nov", value: 3900, benchmark: 2100 },
  { date: "Dec", value: 4500, benchmark: 2200 },
];

export const VOLATILITY_DATA = [
  { month: "Jan", portfolio: 12, market: 18 },
  { month: "Fev", portfolio: 14, market: 20 },
  { month: "Mar", portfolio: 10, market: 17 },
  { month: "Avr", portfolio: 13, market: 19 },
  { month: "Mai", portfolio: 15, market: 22 },
  { month: "Jun", portfolio: 11, market: 16 },
  { month: "Jul", portfolio: 9, market: 15 },
  { month: "Aou", portfolio: 12, market: 18 },
  { month: "Sep", portfolio: 14, market: 21 },
  { month: "Oct", portfolio: 16, market: 23 },
  { month: "Nov", portfolio: 13, market: 20 },
  { month: "Dec", portfolio: 11, market: 17 },
];

export const DRAWDOWN_DATA = [
  { date: "Jan", value: 0 },
  { date: "Fev", value: -2 },
  { date: "Mar", value: -5 },
  { date: "Avr", value: -3 },
  { date: "Mai", value: -7 },
  { date: "Jun", value: -10 },
  { date: "Jul", value: -4 },
  { date: "Aou", value: -2 },
  { date: "Sep", value: -8 },
  { date: "Oct", value: -12 },
  { date: "Nov", value: -6 },
  { date: "Dec", value: -3 },
];
