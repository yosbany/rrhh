import { differenceInMonthsMVD } from './dates';

/**
 * Calculates daily salary based on monthly salary
 */
export function calculateDailySalary(salary: number): number {
  return Math.round((salary / 30) * 100) / 100;
}

/**
 * Calculates accumulated license days based on years of service
 * - Less than 5 years: 20 days per year
 * - More than 5 years: +1 day every 4 years
 */
export function calculateLicenseDays(startDate: string): number {
  const years = Math.abs(differenceInMonthsMVD(new Date(), startDate)) / 12;
  
  // Base days for everyone
  let daysPerYear = 20;
  
  // Additional days for seniority
  if (years > 5) {
    const additionalDays = Math.floor((years - 5) / 4);
    daysPerYear += additionalDays;
  }
  
  // Convert to monthly (days per year / 12) and round to 2 decimals
  const monthlyDays = (daysPerYear / 12);
  return Math.round(monthlyDays * 100) / 100;
}

/**
 * Calculates vacation salary (20% of base salary)
 */
export function calculateVacationalSalary(salary: number): number {
  return Math.round(salary * 0.2 * 100) / 100;
}

/**
 * Calculates aguinaldo (one month's salary divided by 12)
 */
export function calculateAguinaldo(salary: number): number {
  return Math.round((salary / 12) * 100) / 100;
}