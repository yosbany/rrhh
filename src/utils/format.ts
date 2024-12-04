/**
 * Formats a number as currency with 2 decimal places
 * @param amount The number to format
 * @returns Formatted string with 2 decimal places
 */
export function formatMoney(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) {
    return '0.00';
  }
  
  return amount.toLocaleString('es-UY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Formats a date string in the specified format
 * @param date Date string or Date object
 * @param format Optional format string
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, format: string = 'dd/MM/yyyy'): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-UY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}