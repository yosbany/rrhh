import { 
  zonedTimeToUtc, 
  utcToZonedTime, 
  format 
} from 'date-fns-tz';
import { 
  addMonths, 
  endOfMonth, 
  startOfMonth, 
  subDays,
  differenceInMonths,
  isAfter,
  isBefore,
  isSameMonth,
  parseISO
} from 'date-fns';
import { TIMEZONE } from './constants';

export function toMVDTime(date: Date | string): Date {
  try {
    if (!date) throw new Error('Invalid date');
    const inputDate = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(inputDate.getTime())) throw new Error('Invalid date');
    return utcToZonedTime(inputDate, TIMEZONE);
  } catch (error) {
    console.error('Invalid date:', date);
    return new Date();
  }
}

export function fromMVDTime(date: Date): string {
  try {
    if (!date || isNaN(date.getTime())) throw new Error('Invalid date');
    return zonedTimeToUtc(date, TIMEZONE).toISOString();
  } catch (error) {
    console.error('Invalid date:', date);
    return new Date().toISOString();
  }
}

export function startOfMonthMVD(date: Date | string): Date {
  const mvdDate = toMVDTime(date);
  return startOfMonth(mvdDate);
}

export function endOfMonthMVD(date: Date | string): Date {
  const mvdDate = toMVDTime(date);
  return endOfMonth(mvdDate);
}

export function addMonthsMVD(date: Date | string, amount: number): Date {
  const mvdDate = toMVDTime(date);
  return addMonths(mvdDate, amount);
}

export function subDaysMVD(date: Date | string, amount: number): Date {
  const mvdDate = toMVDTime(date);
  return subDays(mvdDate, amount);
}

export function isBeforeMVD(date1: Date | string, date2: Date | string): boolean {
  const mvdDate1 = toMVDTime(date1);
  const mvdDate2 = toMVDTime(date2);
  return isBefore(mvdDate1, mvdDate2);
}

export function isAfterMVD(date1: Date | string, date2: Date | string): boolean {
  const mvdDate1 = toMVDTime(date1);
  const mvdDate2 = toMVDTime(date2);
  return isAfter(mvdDate1, mvdDate2);
}

export function isSameMonthMVD(date1: Date | string, date2: Date | string): boolean {
  const mvdDate1 = toMVDTime(date1);
  const mvdDate2 = toMVDTime(date2);
  return isSameMonth(mvdDate1, mvdDate2);
}

export function differenceInMonthsMVD(date1: Date | string, date2: Date | string): number {
  const mvdDate1 = toMVDTime(date1);
  const mvdDate2 = toMVDTime(date2);
  return differenceInMonths(mvdDate1, mvdDate2);
}

export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM'): string {
  try {
    if (!date) throw new Error('Invalid date');
    const mvdDate = toMVDTime(date);
    if (isNaN(mvdDate.getTime())) throw new Error('Invalid date');
    return format(mvdDate, formatStr, { timeZone: TIMEZONE });
  } catch (error) {
    console.error('Error formatting date:', date);
    return '';
  }
}

export function formatMonthYear(date: Date | string): string {
  return formatDate(date, 'MM/yyyy');
}

export function getCurrentDateMVD(): Date {
  return toMVDTime(new Date());
}

export function toISOStringWithTZ(date: Date): string {
  return fromMVDTime(date);
}