
/**
 * Format date to FR locale
 */
export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

/**
 * Check if premium subscription is expired
 */
export const isExpired = (expiryDate: string | null): boolean => {
  if (!expiryDate) return true;
  const now = new Date();
  const expiry = new Date(expiryDate);
  return now > expiry;
};
