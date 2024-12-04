import { format } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { TIMEZONE } from '../constants';

interface DateFormatOptions {
  showDay?: boolean;
  showMonth?: boolean;
  showYear?: boolean;
  showTime?: boolean;
}

/**
 * Formats a date string according to the specified options
 */
export function formatDate(
  date: string | Date,
  options: DateFormatOptions = {
    showDay: true,
    showMonth: true,
    showYear: true
  }
): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  let formatStr = '';
  if (options.showDay) formatStr += 'dd/';
  if (options.showMonth) formatStr += 'MM/';
  if (options.showYear) formatStr += 'yyyy';
  if (options.showTime) formatStr += ' HH:mm';
  
  return format(dateObj, formatStr, {
    timeZone: TIMEZONE,
    locale: es
  });
}

/**
 * Formats a date as month/year
 */
export function formatMonthYear(date: string | Date): string {
  return formatDate(date, {
    showDay: false,
    showMonth: true,
    showYear: true
  });
}

/**
 * Formats a date with full date and time
 */
export function formatFullDateTime(date: string | Date): string {
  return formatDate(date, {
    showDay: true,
    showMonth: true,
    showYear: true,
    showTime: true
  });
}