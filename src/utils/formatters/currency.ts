/**
 * Formats a number as currency with 2 decimal places
 */
export function formatMoney(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) {
    return '0.00';
  }
  
  return new Intl.NumberFormat('es-UY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}