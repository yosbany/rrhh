import { parseISO } from 'date-fns';

export function parseDate(date: Date | string | null | undefined): Date | null {
  if (!date) return null;
  
  try {
    if (date instanceof Date) {
      return isNaN(date.getTime()) ? null : date;
    }
    
    const parsed = parseISO(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

export function ensureValidDate(date: Date | string | null | undefined): Date {
  const parsed = parseDate(date);
  if (!parsed) {
    return new Date();
  }
  return parsed;
}