
/**
 * Returns a date object for the start of a given timeframe
 */
export const getStartDateFromTimeframe = (tf: string): Date => {
  const now = new Date();
  switch (tf) {
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'quarter':
      return new Date(now.setMonth(now.getMonth() - 3));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    case 'all':
    default:
      return new Date(2000, 0, 1); // A date far in the past
  }
};
