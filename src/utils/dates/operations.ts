import { 
  addMonths,
  endOfMonth,
  startOfMonth,
  subDays,
  differenceInMonths,
  isAfter,
  isBefore,
  isSameMonth
} from 'date-fns';
import { toMVDTime } from './timezone';
import { ensureValidDate } from './parsers';

export function startOfMonthMVD(date: Date | string): Date {
  const mvdDate = toMVDTime(ensureValidDate(date));
  return startOfMonth(mvdDate);
}

export function endOfMonthMVD(date: Date | string): Date {
  const mvdDate = toMVDTime(ensureValidDate(date));
  return endOfMonth(mvdDate);
}

export function addMonthsMVD(date: Date | string, amount: number): Date {
  const mvdDate = toMVDTime(ensureValidDate(date));
  return addMonths(mvdDate, amount);
}

export function subDaysMVD(date: Date | string, amount: number): Date {
  const mvdDate = toMVDTime(ensureValidDate(date));
  return subDays(mvdDate, amount);
}

export function isBeforeMVD(date1: Date | string, date2: Date | string): boolean {
  const mvdDate1 = toMVDTime(ensureValidDate(date1));
  const mvdDate2 = toMVDTime(ensureValidDate(date2));
  return isBefore(mvdDate1, mvdDate2);
}

export function isAfterMVD(date1: Date | string, date2: Date | string): boolean {
  const mvdDate1 = toMVDTime(ensureValidDate(date1));
  const mvdDate2 = toMVDTime(ensureValidDate(date2));
  return isAfter(mvdDate1, mvdDate2);
}

export function isSameMonthMVD(date1: Date | string, date2: Date | string): boolean {
  const mvdDate1 = toMVDTime(ensureValidDate(date1));
  const mvdDate2 = toMVDTime(ensureValidDate(date2));
  return isSameMonth(mvdDate1, mvdDate2);
}

export function differenceInMonthsMVD(date1: Date | string, date2: Date | string): number {
  const mvdDate1 = toMVDTime(ensureValidDate(date1));
  const mvdDate2 = toMVDTime(ensureValidDate(date2));
  return differenceInMonths(mvdDate1, mvdDate2);
}

export function getCurrentDateMVD(): Date {
  return toMVDTime(new Date());
}