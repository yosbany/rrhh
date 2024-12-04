import { format } from 'date-fns-tz';
import { TIMEZONE } from '../constants';
import { ensureValidDate } from './parsers';

export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM'): string {
  try {
    const validDate = ensureValidDate(date);
    return format(validDate, formatStr, { timeZone: TIMEZONE });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

export function formatMonthYear(date: Date | string): string {
  return formatDate(date, 'MM/yyyy');
}

export function formatFullDate(date: Date | string): string {
  return formatDate(date, 'dd/MM/yyyy');
}