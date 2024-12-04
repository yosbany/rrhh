import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { TIMEZONE } from '../constants';
import { ensureValidDate } from './parsers';

export function toMVDTime(date: Date | string): Date {
  const validDate = ensureValidDate(date);
  return utcToZonedTime(validDate, TIMEZONE);
}

export function fromMVDTime(date: Date): string {
  const validDate = ensureValidDate(date);
  return zonedTimeToUtc(validDate, TIMEZONE).toISOString();
}

export function toISOStringWithTZ(date: Date): string {
  return fromMVDTime(date);
}